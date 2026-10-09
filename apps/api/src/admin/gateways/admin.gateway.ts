import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger, Injectable } from '@nestjs/common';
import { DomainEvents } from '../../common/events/domain-events';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
@WebSocketGateway({
  namespace: '/admin',
  cors: { origin: '*' }, // Real deployment would restrict this
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AdminGateway.name);

  constructor(
    private readonly events: DomainEvents,
    private readonly prisma: PrismaService,
  ) {
    this.events.on('admin.verification_submitted', (payload) => {
      this.server.to('admin:Verification').emit('verification.new', payload);
    });
    this.events.on('admin.dispute_opened', (payload) => {
      this.server.to('admin:Operations').emit('dispute.new', payload);
    });
    this.events.on('admin.incident_reported', (payload) => {
      this.server.to('admin:Safety').emit('incident.new', payload);
    });
  }

  async handleConnection(client: Socket) {
    // In a real implementation we would decode the JWT token, check if they are admin,
    // and then add them to the relevant role rooms.
    const token = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      // Very basic simulation of JWT parsing and user role assignment for admin feed
      // Normally uses JwtService
      const adminId = this.parseTokenSimulated(token);
      if (!adminId) throw new Error('Invalid token');

      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
        select: { adminRoles: true },
      });

      if (!admin || !admin.adminRoles) {
        client.disconnect();
        return;
      }

      admin.adminRoles.forEach(role => {
        client.join(`admin:${role}`);
      });
      if (admin.adminRoles.includes('Super Admin')) {
        // Super admin joins all relevant rooms for notifications
        ['Verification', 'Operations', 'Safety', 'Support', 'Finance'].forEach(role => {
          client.join(`admin:${role}`);
        });
      }

      this.logger.log(`Admin ${adminId} connected to realtime feed`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private parseTokenSimulated(token: string): string | null {
    // Simulated since we don't inject JwtService here to avoid circular dep
    // In actual implementation, we verify token and extract user id
    if (token.startsWith('admin-')) {
      return token.replace('admin-', '');
    }
    return null; // Reject if not valid
  }
}
