import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { User as UserDecorator } from '../users/user.decorator';
import { QuestionsService } from './questions.service';
import { Question } from './question.entity';

@Controller('api/rooms/:roomId/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsApiController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(
    @Param('roomId', ParseIntPipe) roomId: number,
    @UserDecorator() user: User,
    @Body() questionCreate: QuestionCreate,
  ) {
    return this.questionsService.create(roomId, questionCreate, user);
  }

  @Get()
  findAll(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.questionsService.findAll(roomId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Question> {
    return await this.questionsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() questionUpdate: QuestionUpdate,
  ): Promise<Question> {
    return await this.questionsService.update(+id, questionUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
