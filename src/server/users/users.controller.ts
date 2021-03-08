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

@Controller('users')
export class UsersController {
  constructor(private readonly next: NextService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    this.next.render('/users', req, res);
  }

  @Get('new')
  createForm(@Req() req: IncomingMessage, @Res() res: ServerResponse): void {
    this.next.render(`/users/new`, req, res);
  }

  @Get(':id/edit')
  @UseGuards(JwtAuthGuard)
  public async showEdit(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render(`/users/${id}/edit`, req, res);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    this.next.render(`/users/${id}`, req, res);
  }
}
