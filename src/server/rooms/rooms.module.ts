import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { NextModule } from '../nextjs/next.module';
import { QuestionsModule } from '../questions/questions.module';
import { Room } from './room.entity';
import { RoomsApiController } from './rooms.api-controller';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsService],
  imports: [
    QuestionsModule,
    NextModule,
    CaslModule,
    TypeOrmModule.forFeature([Room]),
  ],
  controllers: [RoomsController, RoomsApiController],
  exports: [RoomsService],
})
export class RoomsModule {}
