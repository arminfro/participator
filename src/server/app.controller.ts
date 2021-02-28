import { Controller, Get, Req, Res } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { NextService } from './nextjs/next.service';

@Controller()
export class AppController {
  constructor(private readonly next: NextService) {}

  @Get()
  async index(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    this.next.render('/', req, res);
  }
}
