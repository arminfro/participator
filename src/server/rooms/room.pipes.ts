import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RoomCreate, RoomUpdate } from '../../types/room';
import {
  validateRoomUpdate,
  validateRoomCreate,
} from '../../types/room.validation';

@Injectable()
export class RoomUpdatePipe implements PipeTransform<RoomUpdate, RoomUpdate> {
  transform(room: RoomUpdate): RoomUpdate | never {
    const [errors] = validateRoomUpdate(room);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return room;
  }
}

@Injectable()
export class RoomCreatePipe implements PipeTransform<RoomCreate, RoomCreate> {
  transform(room: RoomCreate): RoomCreate | never {
    const [errors] = validateRoomCreate(room);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return room;
  }
}
