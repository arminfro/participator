import { Injectable, PipeTransform } from '@nestjs/common';
import { UserCreate, UserUpdate } from '../../types/user';
import {
  validateUserUpdate,
  validateUserCreate,
} from '../../types/user.validation';

@Injectable()
export class UserUpdatePipe implements PipeTransform<UserUpdate, UserUpdate> {
  transform(room: UserUpdate): UserUpdate {
    validateUserUpdate(room);
    return room;
  }
}

@Injectable()
export class UserCreatePipe implements PipeTransform<UserCreate, UserCreate> {
  transform(room: UserCreate): UserCreate {
    validateUserCreate(room);
    return room;
  }
}
