import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(username: string, password: string, res: Response) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.usersService.validatePassword(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('access-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return { message: 'Login successful', user: { id: user.id, username: user.username } };
  }


  async register(
    username: string,
    password: string,
    email?: string,
  ): Promise<{ message: string; user?: any }> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    try {
      const user = await this.usersService.createUser(username, password, email);
      return {
        message: 'User created successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

}