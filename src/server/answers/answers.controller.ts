import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NextService } from '../nextjs/next.service';

@Controller('rooms/:roomId/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
  constructor(private readonly next: NextService) {}

  @Get('new')
  public async createForm(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<void> {
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}/answers/new`,
      req,
      res,
    );
  }

  @Get(':id')
  public async findOne(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('id', ParseIntPipe) answerId: number,
  ): Promise<void> {
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}/answers/${answerId}`,
      req,
      res,
    );
  }
}
