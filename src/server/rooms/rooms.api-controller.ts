import { subject } from '@casl/ability';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { Response } from 'express';
import { ability, AppAbility } from '../../casl/ability';
import { Action } from '../../casl/action';
import Room, { RoomCreate, RoomUpdate } from '../../types/room';
import { User } from '../../types/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IPolicyHandler } from '../casl/policies.guard';
import { User as UserDecorator } from '../users/user.decorator';
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
    @Body() roomCreate: RoomCreate,
  ): Promise<Room> {
    return await this.roomsService.create({ ...roomCreate, admin: user });
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return await this.roomsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  // @UsePolicy((ability: AppAbility) => ability.can(Action.Manage, 'Room'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: User,
    @Body() roomUpdate: RoomUpdate,
    @Res() res: Response,
  ): Promise<UpdateResult | void> {
    const room = await this.roomsService.findOne(id);
    if (
      ability(user).can(Action.Manage, subject('Room', room)) ||
      (room.openToJoin && roomUpdate.addMember)
    ) {
      res.send(this.roomsService.update(id, roomUpdate));
    } else {
      console.log('FORBIDDEN');
      res.status(HttpStatus.FORBIDDEN).send();
    }
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.roomsService.remove(id);
  // }
}
