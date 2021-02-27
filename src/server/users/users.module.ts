import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { MailerService } from '../mailer/mailer.service';
import { NextModule } from '../nextjs/next.module';
import { UserSubscriber } from '../users/user.subscriber';
import { User } from './user.entity';
import { UsersApiController } from './users.api-controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UserSubscriber, MailerService, Logger],
  imports: [NextModule, CaslModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController, UsersApiController],
  exports: [UsersService],
})
export class UsersModule {}
