import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as UserDecorator } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { Question } from './question.entity';
import { QuestionCreatePipe, QuestionUpdatePipe } from './question.pipe';
import { QuestionsService } from './questions.service';

@Controller('api/rooms/:roomId/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsApiController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(
    @Param('roomId', ParseIntPipe) roomId: number,
    @UserDecorator() user: User,
    @Body(new QuestionCreatePipe()) questionCreate: QuestionCreate,
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new QuestionUpdatePipe()) questionUpdate: QuestionUpdate,
  ): Promise<Question> {
    return await this.questionsService.update(+id, questionUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
