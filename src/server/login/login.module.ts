import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MailerService } from '../mailer/mailer.service';
import { NextModule } from '../nextjs/next.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import PasswordRecover from './password-recover.entity';

@Module({
  providers: [MailerService, UsersService, LoginService, Logger],
  imports: [
    NextModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User, PasswordRecover]),
  ],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}
