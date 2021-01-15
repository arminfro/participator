import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Action } from '../../casl/action';
import { UserCreate } from '../../types/user';
import { AppAbility } from '../casl/casl-ability.factory';
import { UsePolicy } from '../casl/use-policy.decorator';
import { User as UserDecorator } from './user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UsePolicy((ability: AppAbility) => ability.can(Action.Read, User))
  public async index(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('token-to-user')
  @UsePolicy((ability: AppAbility) => ability.can(Action.Manage, User))
  public async tokenToUser(@UserDecorator() user: User): Promise<User> {
    return user;
  }

  @Get(':id')
  @UsePolicy((ability: AppAbility) => ability.can(Action.Read, User))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | undefined> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePolicy((ability: AppAbility) => ability.can(Action.Update, User))
  async editOne(
    @UserDecorator() user: User,
    @Body() newUser: User,
  ): Promise<void> {
    console.log('going to update');
    await this.usersService.update(user.id, newUser);
  }

  @Delete(':id')
  @HttpCode(204)
  @UsePolicy((ability: AppAbility) => ability.can(Action.Delete, User))
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @Post('new')
  @HttpCode(201)
  public async create(@Body() userCreate: UserCreate): Promise<User> {
    return await this.usersService.create(userCreate);
  }
}
