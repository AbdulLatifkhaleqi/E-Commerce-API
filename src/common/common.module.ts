import { Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { AuthTokenService } from './services/auth-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  providers: [PasswordService, AuthTokenService],
  exports: [PasswordService, AuthTokenService],
})
export class CommonModule {}
