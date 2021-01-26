import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextModule } from '../nextjs/next.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSubscriber } from '../users/user.subscriber';
import { User } from './user.entity';
import { CaslModule } from '../casl/casl.module';
import { UsersApiController } from './users.api-controller';

@Module({
  providers: [UsersService, UserSubscriber],
  imports: [NextModule, CaslModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController, UsersApiController],
  exports: [UsersService],
})
export class UsersModule {}
