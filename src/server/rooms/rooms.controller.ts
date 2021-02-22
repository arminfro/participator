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
import { RoomsService } from './rooms.service';
import { UsePolicy } from '../casl/use-policy.decorator';
import { Action } from '../../casl/action';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(
    private readonly next: NextService,
    private readonly roomsService: RoomsService,
  ) {}

  @Get()
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    const rooms = await this.roomsService.findAll();
    this.next.render('/rooms', { rooms }, req, res);
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
    const room = await this.roomsService.findOne(id);
    await this.next.render(`/rooms/${id}/edit`, { room }, req, res);
  }

  @Get(':id')
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    const room = await this.roomsService.findOne(id);
    this.next.render(`/rooms/${id}`, { room }, req, res);
  }
}
