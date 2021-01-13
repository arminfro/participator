import { IncomingMessage, ServerResponse } from 'http';
import { Controller, Get, Req, Res, Post, UseGuards } from '@nestjs/common';
import { NextService } from './nextjs/next.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AccessToken } from './auth/auth.service';
import User from '../types/user';

@Controller()
export class AppController {
  constructor(
    private readonly next: NextService,
    private authService: AuthService,
  ) {}

  @Get()
  async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render('/', req, res);
  }

  @Get('login')
  public async loginForm(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render('/login', req, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: IncomingMessage & { user: User },
  ): Promise<AccessToken> {
    return this.authService.login(req.user);
  }
}
