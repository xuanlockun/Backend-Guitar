import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { UsersService } from '../users/users.service';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from 'src/users/user.entity';

export class SignInDto {
  username: string;
  email: string;
  password: string;
}

export class RegisterDto {
  username: string;
  password: string;
  email?: string;
}

@Controller('auth')
export class AuthController {
  // constructor(private authService: AuthService) { }
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(signInDto.username,signInDto.email, signInDto.password, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.email
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all')
  async findAll() {
    return this.userService.findAll(); 
  }
}