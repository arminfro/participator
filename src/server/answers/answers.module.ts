import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersApiController } from './answers.api-controller';
import { AnswersController } from './answers.controller';
import { Answer } from './answer.entity';
import { NextModule } from '../nextjs/next.module';

@Module({
  controllers: [AnswersController, AnswersApiController],
  imports: [NextModule, TypeOrmModule.forFeature([Answer])],
  providers: [AnswersService],
})
export class AnswersModule {}
