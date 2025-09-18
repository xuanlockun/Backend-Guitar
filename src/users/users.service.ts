import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(username: string): Promise<any> {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) return undefined;
    
    return {
      userId: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
    };
  }

  async createUser(username: string, password: string, email?: string): Promise<any> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await this.usersRepository.findByEmail(email);
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.usersRepository.createUser({
      username,
      password: hashedPassword,
      email
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}