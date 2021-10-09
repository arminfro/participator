import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RenderableResponse } from 'nest-next';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @Render('users')
  public async index(): Promise<any> {
    return {};
  }

  @Get('new')
  @Render('/users/new')
  createForm(): any {
    return {};
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: RenderableResponse,
  ): Promise<void> {
    res.render(`/users/${id}`);
  }
}
