import { StorageModule } from '@codebrew/nestjs-storage';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { LoginService } from '../login/login.service';
import PasswordRecover from '../login/password-recover.entity';
import { MailerService } from '../mailer/mailer.service';
import { UserSubscriber } from '../users/user.subscriber';
import { User } from './user.entity';
import { UsersApiController } from './users.api-controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersService,
    LoginService,
    UserSubscriber,
    MailerService,
    Logger,
  ],
  imports: [
    CaslModule,
    StorageModule,
    TypeOrmModule.forFeature([User, PasswordRecover]),
  ],
  controllers: [UsersController, UsersApiController],
  exports: [UsersService],
})
export class UsersModule {}
