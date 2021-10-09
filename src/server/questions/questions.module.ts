import { Module } from '@nestjs/common';

import { QuestionsService } from './questions.service';
import { QuestionsApiController } from './questions.api-controller';
import { QuestionsController } from './questions.controller';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixAnswer } from './fix-answer.entity';

@Module({
  controllers: [QuestionsController, QuestionsApiController],
  imports: [
    TypeOrmModule.forFeature([Question]),
    TypeOrmModule.forFeature([FixAnswer]),
  ],
  providers: [QuestionsService],
})
export class QuestionsModule {}
