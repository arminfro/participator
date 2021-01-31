import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [QuestionsController],
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService],
})
export class QuestionsModule {}
