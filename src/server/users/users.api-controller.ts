import {
  ParseIntPipe,
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserCreate } from '../../types/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async index(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | undefined> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async editOne(
    @Body() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.usersService.update(id, user);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // todo, check if req.user.id is same
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @HttpCode(201)
  @Post('new')
  public async create(@Body() userCreate: UserCreate): Promise<User> {
    return await this.usersService.create(userCreate);
  }
}
