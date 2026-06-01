import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // async createUser(dto: CreateUserDto) {
  //   const existingUser = await this.usersRepository.findByEmail(dto.email);

  //   if (existingUser) {
  //     throw new ConflictException('Email already exists');
  //   }

  //   return this.usersRepository.create(dto);
  // }

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

  // async updateUser(id: string, dto: UpdateUserDto) {
  //   const user = await this.usersRepository.update(id, dto);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return user;
  // }

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
