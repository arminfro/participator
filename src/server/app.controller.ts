import { IncomingMessage, ServerResponse } from 'http';
import { Controller, Get, Req, Res, Post, UseGuards } from '@nestjs/common';
import { NextService } from './nextjs/next.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AccessToken } from './auth/auth.service';
import User from '../types/user';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly next: NextService,
    private authService: AuthService,
    private userService: UsersService,
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
    await this.next.render('/login-form', req, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: IncomingMessage & { user: User },
  ): Promise<AccessToken & { user: User }> {
    console.log('req.user', req.user);
    return {
      access_token: (await this.authService.login(req.user)).access_token,
      user: await this.userService.findOne(req.user.id),
    };
  }
}
