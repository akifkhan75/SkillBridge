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

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - new Date().getTime()) / 60000);
      throw new UnauthorizedException(`Account locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`);
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      let lockoutUntil = null;

      if (failedAttempts >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60000); // Lock for 15 mins
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: failedAttempts, lockoutUntil },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on success
    if (user.failedLoginAttempts > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockoutUntil: null },
      });
    }

    const { password: _, failedLoginAttempts: __, lockoutUntil: ___, ...userWithoutPassword } = user;
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
