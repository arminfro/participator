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
  UseGuards,
} from '@nestjs/common';
import { AppAbility } from '../../casl/ability';
import { Action } from '../../casl/action';
import { UserCreate } from '../../types/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsePolicy } from '../casl/use-policy.decorator';
import { User as UserDecorator } from './user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePolicy((ability: AppAbility) => ability.can(Action.Read, 'User'))
  public async index(): Promise<User[]> {
    return await this.usersService.findAll({
      relations: ['ownedRooms', 'joinedRooms'],
    });
  }

  @Get('token-to-user')
  @UseGuards(JwtAuthGuard)
  public async tokenToUser(@UserDecorator() user: User): Promise<User> {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePolicy((ability: AppAbility) => ability.can(Action.Read, 'User'))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | undefined> {
    return await this.usersService.findOne(id, {
      relations: ['ownedRooms', 'joinedRooms'],
    });
  }

  @Patch(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @UsePolicy((ability: AppAbility) => ability.can(Action.Update, 'User'))
  async editOne(
    @UserDecorator() user: User,
    @Body() newUser: User,
  ): Promise<void> {
    console.log('going to update');
    await this.usersService.update(user.id, newUser);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @UsePolicy((ability: AppAbility) => ability.can(Action.Delete, 'User'))
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() userCreate: UserCreate): Promise<User> {
    return await this.usersService.create(userCreate);
  }
}
