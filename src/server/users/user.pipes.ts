import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserCreate, UserPasswordUpdate, UserUpdate } from '../../types/user';
import {
  validateUserUpdate,
  validateUserCreate,
  validateUserPasswordUpdate,
} from '../../types/user.validation';

@Injectable()
export class UserUpdatePipe implements PipeTransform<UserUpdate, UserUpdate> {
  transform(user: UserUpdate): UserUpdate | never {
    const [errors] = validateUserUpdate(user);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}

@Injectable()
export class UserPasswordUpdatePipe
  implements PipeTransform<UserPasswordUpdate, UserPasswordUpdate>
{
  transform(user: UserPasswordUpdate): UserPasswordUpdate | never {
    const [errors] = validateUserPasswordUpdate(user);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}

@Injectable()
export class UserCreatePipe implements PipeTransform<UserCreate, UserCreate> {
  transform(user: UserCreate): UserCreate | never {
    const [errors] = validateUserCreate(user);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
