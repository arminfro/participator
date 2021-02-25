import { Injectable, PipeTransform } from '@nestjs/common';
import { RoomCreate, RoomUpdate } from '../../types/room';
import {
  validateRoomUpdate,
  validateRoomCreate,
} from '../../types/room.validation';

@Injectable()
export class RoomUpdatePipe implements PipeTransform<RoomUpdate, RoomUpdate> {
  transform(room: RoomUpdate): RoomUpdate {
    validateRoomUpdate(room);
    return room;
  }
}

@Injectable()
export class RoomCreatePipe implements PipeTransform<RoomCreate, RoomCreate> {
  transform(room: RoomCreate): RoomCreate {
    validateRoomCreate(room);
    return room;
  }
}
