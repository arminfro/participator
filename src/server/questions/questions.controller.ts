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
import { QuestionsService } from './questions.service';

@Controller('rooms/:roomId/questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(
    private readonly next: NextService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Get()
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<void> {
    const questions = await this.questionsService.findAll(roomId);
    this.next.render(`/rooms/${roomId}/questions`, { questions }, req, res);
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
    const question = await this.questionsService.findOne(questionId);
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}/edit`,
      { question },
      req,
      res,
    );
  }

  @Get(':id')
  public async findOne(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('id', ParseIntPipe) questionId: number,
  ): Promise<void> {
    const question = await this.questionsService.findOne(questionId);
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}`,
      { question },
      req,
      res,
    );
  }
}
