import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, CommonModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
