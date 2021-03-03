import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { AccessToken, AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { NextService } from '../nextjs/next.service';
import { User } from '../users/user.entity';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly next: NextService,
    private authService: AuthService,
    private loginService: LoginService,
  ) {}

  @Get()
  public async loginForm(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render('/login', req, res);
  }

  @Get('password/reset/:id')
  async passwordReset(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    const user = await this.loginService.findByPasswordRecoverId(id);
    if (!user) {
      throw new HttpException(
        'no password recover available, link is invalid',
        HttpStatus.NOT_FOUND,
      );
    }
    this.next.render('/users/password-reset', { id, user }, req, res);
  }

  @Post('password/recover')
  async passwordRecover(
    @Body() payload: { id: string; email: string },
  ): Promise<void> {
    return this.loginService.recoverPassword(payload.email);
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @Req() req: IncomingMessage & { user: User },
  ): Promise<AccessToken & { user: User }> {
    return {
      access_token: (await this.authService.login(req.user)).access_token,
      user: await this.loginService.findOneUser(req.user.id),
    };
  }
}
