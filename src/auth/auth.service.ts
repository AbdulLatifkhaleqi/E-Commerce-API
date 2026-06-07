import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UsersRepository } from 'src/users/users.repository';
import { PasswordService } from 'src/common/services/password.service';
import { LoginDto } from './dtos/login.dto';
import { AuthTokenService } from 'src/common/services/auth-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////// register user.
  async register(payload: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.passwordService.hash(payload.password);

    const user = await this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    const accessToken = await this.authTokenService.generateAccessToken({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      message: 'Registration successful',
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    };
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////// login user.
  async login(payload: LoginDto) {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.verify(
      user.password,
      payload.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authTokenService.generateAccessToken({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    };
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////// logout.
  async logout() {
    return {
      message: 'Logout successful',
    };
  }
}
