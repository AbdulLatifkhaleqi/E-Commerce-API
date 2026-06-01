import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [UsersModule, CommonModule],
  providers: [AuthService],
})
export class AuthModule {}
