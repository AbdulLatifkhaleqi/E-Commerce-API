import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UsersRepository } from 'src/users/users.repository';
import { PasswordService } from 'src/common/services/password.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async register(payload: RegisterDto) {
    const existUser = await this.userRepository.findByEmail(payload.email);
    if (existUser) {
      throw new ConflictException('Email address already exist.');
    }

    return this.userRepository.create({
      ...payload,
      password: await this.passwordService.hash(payload.password),
    });
  }

  async login(payload: LoginDto) {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.passwordService.verify(
      user.password,
      payload.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
