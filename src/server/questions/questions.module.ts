import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsApiController } from './questions.api-controller';
import { QuestionsController } from './questions.controller';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextModule } from '../nextjs/next.module';

@Module({
  controllers: [QuestionsController, QuestionsApiController],
  imports: [NextModule, TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService],
})
export class QuestionsModule {}
