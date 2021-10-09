import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersApiController } from './answers.api-controller';
import { AnswersController } from './answers.controller';
import { Answer } from './answer.entity';

@Module({
  controllers: [AnswersController, AnswersApiController],
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswersService],
})
export class AnswersModule {}
