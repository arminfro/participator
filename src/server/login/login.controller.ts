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
import { IncomingMessage } from 'http';
import { RenderableResponse } from 'nest-next';
import { AccessToken, AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { User } from '../users/user.entity';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
  ) {}

  @Get()
  public async loginForm(@Res() res: RenderableResponse): Promise<void> {
    res.render('login');
  }

  @Get('password/reset/:id')
  async passwordReset(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: RenderableResponse,
  ): Promise<void> {
    const user = await this.loginService.findByPasswordRecoverId(id);
    if (!user) {
      throw new HttpException(
        'no password recover available, link is invalid',
        HttpStatus.NOT_FOUND,
      );
    }
    res.render('users/password-reset', { id: id, user: JSON.stringify(user) });
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
