import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsApiController } from './rooms.api-controller';
import { RoomsController } from './rooms.controller';
import { Room } from './room.entity';
import { NextModule } from '../nextjs/next.module';
import { CaslModule } from '../casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RoomsService],
  imports: [NextModule, CaslModule, TypeOrmModule.forFeature([Room])],
  controllers: [RoomsController, RoomsApiController],
})
export class RoomsModule {}
