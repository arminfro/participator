import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RenderableResponse } from 'nest-next';
import { Action } from '../../casl/action';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsePolicy } from '../casl/use-policy.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  @Get()
  public async index(@Res() res: RenderableResponse): Promise<void> {
    res.render('rooms');
  }

  @Get(':id')
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: RenderableResponse,
  ): Promise<void> {
    res.render(`rooms/${id}`);
  }

  @Get(':id/users')
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  async findUsers(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: RenderableResponse,
  ): Promise<void> {
    res.render(`rooms/${id}/users`);
  }

  @Get(':id/chat')
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  async findChat(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: RenderableResponse,
  ): Promise<void> {
    res.render(`rooms/${id}/chat`);
  }
}
