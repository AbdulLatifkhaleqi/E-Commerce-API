import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UsersRepository } from 'src/users/users.repository';
import { LoginDto } from './dtos/login.dto';
import { PasswordProvider } from './providers/password.provider';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordProvider: PasswordProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////// register user.
  async register(payload: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.passwordProvider.hash(payload.password);

    const user = await this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user._id,
        email: user.email,
      },
      {
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

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

    const isPasswordValid = await this.passwordProvider.verify(
      user.password,
      payload.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user._id,
        email: user.email,
      },
      {
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
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
