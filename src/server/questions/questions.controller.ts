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

@Controller('rooms/:roomId/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  @Get()
  public async index(
    @Res() res: RenderableResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<void> {
    res.render(`/rooms/${roomId}/questions`);
  }

  @Get(':id')
  public async findOne(
    @Res() res: RenderableResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('id', ParseIntPipe) questionId: number,
  ): Promise<void> {
    res.render(`/rooms/${roomId}/questions/${questionId}`);
  }
}
