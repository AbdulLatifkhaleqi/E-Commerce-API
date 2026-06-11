import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { LoginDto } from 'src/auth/dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async register(payload: RegisterDto) {
    return await this.authService.register(payload);
  }

  async login(payload: LoginDto) {
    return await this.authService.login(payload);
  }

  async getAllUsers() {
    return this.usersRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.update(id, dto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.delete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
    };
  }
}
