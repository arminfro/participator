import { IncomingMessage, ServerResponse } from 'http';
import {
  Controller,
  Get,
  Req,
  Res,
  ParseIntPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NextService } from '../nextjs/next.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsePolicy } from '../casl/use-policy.decorator';
import { Action } from '../../casl/action';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly next: NextService) {}

  @Get()
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    this.next.render('/rooms', req, res);
  }

  @Get('new')
  createForm(@Req() req: IncomingMessage, @Res() res: ServerResponse): void {
    this.next.render(`/rooms/new`, req, res);
  }

  @Get(':id/edit')
  @UsePolicy((ability, subjects) => ability.can(Action.Update, subjects.room))
  public async showEdit(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render(`/rooms/${id}/edit`, req, res);
  }

  @Get(':id')
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    this.next.render(`/rooms/${id}`, req, res);
  }
}
