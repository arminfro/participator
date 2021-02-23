import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { AppAbility } from '../../casl/ability';
import { Action } from '../../casl/action';
import { Room } from '../../types/room';
import { User } from '../../types/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IPolicyHandler } from '../casl/policies.guard';
import { UsePolicy } from '../casl/use-policy.decorator';
import { User as UserDecorator } from '../users/user.decorator';
import { RoomCreatePipe, RoomUpdatePipe } from './room.pipes';
import { RoomsService } from './rooms.service';

export class ManageRoomPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, 'Room');
  }
}

@Controller('api/rooms')
@UseGuards(JwtAuthGuard)
export class RoomsApiController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(
    @UserDecorator() user: User,
    @Body(new RoomCreatePipe()) roomCreate: any,
  ): Promise<Room> {
    return await this.roomsService.create({ ...roomCreate, admin: user });
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return await this.roomsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePolicy((ability, subjects) => ability.can(Action.Update, subjects.room))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new RoomUpdatePipe()) roomUpdate: any,
  ): Promise<UpdateResult | void> {
    return this.roomsService.update(id, roomUpdate);
  }

  // @Delete(':id')
  // @UsePolicy((ability, subjects) => ability.can(Action.Delete, subjects.room))
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.roomsService.remove(id);
  // }
}
