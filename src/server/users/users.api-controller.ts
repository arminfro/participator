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
import { Action } from '../../casl/action';
import { UserCreate, UserUpdate } from '../../types/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsePolicy } from '../casl/use-policy.decorator';
import { User as UserDecorator } from './user.decorator';
import { User } from './user.entity';
import { UserCreatePipe, UserUpdatePipe } from './user.pipes';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UsePolicy((ability) => ability.can(Action.Read, 'User'))
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
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.user))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | undefined> {
    return await this.usersService.findOne(id, {
      relations: ['ownedRooms', 'joinedRooms'],
    });
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePolicy((ability, subjects) => ability.can(Action.Update, subjects.user))
  async editOne(
    @UserDecorator() user: User,
    @Body(new UserUpdatePipe()) userUpdate: UserUpdate,
  ): Promise<void> {
    await this.usersService.update(user.id, userUpdate);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @UsePolicy((ability, subjects) => ability.can(Action.Delete, subjects.user))
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @Post()
  @HttpCode(201)
  public async create(
    @Body(new UserCreatePipe()) userCreate: UserCreate,
  ): Promise<User> {
    return await this.usersService.create(userCreate);
  }
}
