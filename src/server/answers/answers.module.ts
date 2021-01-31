import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { Answer } from './answer.entity';

@Module({
  controllers: [AnswersController],
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswersService],
})
export class AnswersModule {}
