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

@Controller('rooms/:roomId/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly next: NextService) {}

  @Get()
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.next.render(`/rooms/${roomId}/questions`, req, res);
  }

  @Get('new')
  public async createForm(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<void> {
    this.next.render(`/rooms/${roomId}/questions/new`, req, res);
  }

  @Get(':id/edit')
  public async editOne(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('id', ParseIntPipe) questionId: number,
  ): Promise<void> {
    this.next.render(`/rooms/${roomId}/questions/${questionId}/edit`, req, res);
  }

  @Get(':id')
  public async findOne(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('id', ParseIntPipe) questionId: number,
  ): Promise<void> {
    this.next.render(`/rooms/${roomId}/questions/${questionId}`, req, res);
  }
}
