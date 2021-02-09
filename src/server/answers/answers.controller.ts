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
import { AnswersService } from './answers.service';

@Controller('rooms/:roomId/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class AnswersController {
  constructor(
    private readonly next: NextService,
    private readonly answersService: AnswersService,
  ) {}

  @Get()
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<void> {
    const answers = await this.answersService.findAll(questionId);
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}/answers`,
      { answers },
      req,
      res,
    );
  }

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

  @Get(':id/edit')
  public async editOne(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('id', ParseIntPipe) answerId: number,
  ): Promise<void> {
    const answer = await this.answersService.findOne(answerId);
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}/answers/${answerId}/edit`,
      { answer },
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
    const answer = await this.answersService.findOne(answerId);
    this.next.render(
      `/rooms/${roomId}/questions/${questionId}/answers/${answerId}`,
      { answer },
      req,
      res,
    );
  }
}
