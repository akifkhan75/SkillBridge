import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY, AdminRole } from '../decorators/admin-roles.decorator';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[] | undefined>(ADMIN_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || user.type !== 'admin') {
      throw new ForbiddenException('You must be an admin to perform this action');
    }

    const adminUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { adminRoles: true }
    });

    if (!adminUser) throw new ForbiddenException('Admin user not found');
    
    // Super Admin has all permissions
    if (adminUser.adminRoles.includes('Super Admin')) return true;

    const hasRole = requiredRoles.some((role) => adminUser.adminRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required admin role for this action');
    }

    return true;
  }
}
