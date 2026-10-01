import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        type: dto.type,
        profileImageUrl:
          dto.type === 'customer'
            ? 'https://picsum.photos/seed/newcustomer/100'
            : 'https://picsum.photos/seed/newworker/200',
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If worker type, create worker profile
    if (dto.type === 'worker') {
      await this.prisma.worker.create({
        data: {
          id: user.id,
          skills: ['GENERAL_HANDYMAN'],
        },
      });
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  private generateToken(user: { id: string; email: string; type: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      type: user.type,
    });
  }
}
