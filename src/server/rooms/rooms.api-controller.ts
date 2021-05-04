import { subject } from '@casl/ability';
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
import { ability, AppAbility } from '../../casl/ability';
import { Action } from '../../casl/action';
import { Room, RoomCreate, RoomUpdate } from '../../types/room';
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
    @Body(new RoomCreatePipe()) roomCreate: RoomCreate,
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
  @UsePolicy((ability, subjects) => ability.can(Action.Update, subjects.room))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new RoomUpdatePipe()) roomUpdate: RoomUpdate,
  ): Promise<Room> {
    await this.roomsService.update(id, roomUpdate);
    return this.roomsService.findOne(id);
  }

  @Patch(':id/removeMember')
  @HttpCode(204)
  @UsePolicy((ability, subjects) => ability.can(Action.Update, subjects.room))
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Body(new RoomUpdatePipe()) roomUpdate: RoomUpdate,
  ): Promise<UpdateResult | void> {
    return this.roomsService.update(id, {
      removeMember: roomUpdate.removeMember,
    });
  }

  @Patch(':id/addMember')
  @HttpCode(204)
  async addMember(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: User,
    @Body(new RoomUpdatePipe()) roomUpdate: RoomUpdate,
  ): Promise<UpdateResult | void> {
    const room = await this.roomsService.findOne(id);
    if (
      room.openToJoin ||
      ability(user).can(Action.Update, subject('Room', room))
    ) {
      return this.roomsService.update(id, { addMember: roomUpdate.addMember });
    }
  }

  // @Delete(':id')
  // @UsePolicy((ability, subjects) => ability.can(Action.Delete, subjects.room))
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.roomsService.remove(id);
  // }
}
