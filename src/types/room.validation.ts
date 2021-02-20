import { Struct } from 'superstruct';
import { RoomCreate, RoomUpdate } from './room';
import { customValidate, ValidationResult } from './utils.validation';

export function validateRoomCreate(
  room: RoomCreate,
): ValidationResult<RoomCreate> {
  return validateRoom<RoomCreate>(room, RoomCreate);
}

export function validateRoomUpdate(
  room: RoomUpdate,
): ValidationResult<RoomUpdate> {
  return validateRoom<RoomUpdate>(room, RoomUpdate);
}

export function validateRoom<T>(
  room: T,
  struct: Struct<T>,
): ValidationResult<T> {
  return customValidate<T>(room, struct, (failure) => {
    switch (failure.key) {
      case 'name':
        failure.message = 'Name needs to have at least three characters';
        break;
      default:
    }
    return failure;
  });
}
