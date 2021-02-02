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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly next: NextService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    const users = await this.usersService.findAll();
    this.next.render('/users', { users }, req, res);
  }

  @Get('new')
  createForm(@Req() req: IncomingMessage, @Res() res: ServerResponse): void {
    this.next.render(`/users/new`, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/edit')
  public async showEdit(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    const user = await this.usersService.findOne(id);
    await this.next.render(`/users/${id}/edit`, { user }, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    const user = await this.usersService.findOne(id);
    this.next.render(`/users/${id}`, { user }, req, res);
  }
}
