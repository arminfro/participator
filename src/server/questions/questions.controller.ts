import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionCreate } from '../../types/question';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { User as UserDecorator } from '../users/user.decorator';
import { QuestionsService } from './questions.service';

@Controller('api/rooms/:roomId/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  // return this.questionsService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() questionUpdate: QuestionUpdate) {
  // return this.questionsService.update(+id, questionUpdate);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  // return this.questionsService.remove(+id);
  // }
}
