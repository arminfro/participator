import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RenderableResponse } from 'nest-next';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rooms/:roomId/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
  @Get('new')
  public async createForm(
    @Res() res: RenderableResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<void> {
    res.render(`/rooms/${roomId}/questions/${questionId}/answers/new`);
  }

  @Get(':id')
  public async findOne(
    @Res() res: RenderableResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('id', ParseIntPipe) answerId: number,
  ): Promise<void> {
    res.render(`/rooms/${roomId}/questions/${questionId}/answers/${answerId}`);
  }
}
