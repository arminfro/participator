import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnswerCreate } from '../../types/answer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as UserDecorator } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { AnswersService } from './answers.service';

@Controller('api/rooms/:roomId/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  create(
    @Body() answerCreate: AnswerCreate,
    @Param('questionId', ParseIntPipe) questionId: number,
    @UserDecorator() user: User,
  ) {
    return this.answersService.create(answerCreate, questionId, user);
  }

  @Get()
  findAll(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.answersService.findAll(questionId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.answersService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() answerUpdate: AnswerUpdate) {
  //   return this.answersService.update(+id, answerUpdate);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.answersService.remove(+id);
  // }
}
