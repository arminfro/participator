import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextModule } from '../nextjs/next.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSubscriber } from '../users/user.subscriber';
import { User } from './user.entity';
import { CaslModule } from '../casl/casl.module';

@Module({
  providers: [UsersService, UserSubscriber],
  imports: [NextModule, CaslModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
