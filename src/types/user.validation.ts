import { Struct } from 'superstruct';
import { UserCreate, UserLogin, UserUpdate, UserUpdateToggle } from './user';
import { customValidate, ValidationResult } from './utils';

export function validateUserCreate(
  userCreate: UserCreate,
): ValidationResult<UserCreate> {
  return validateUser<UserCreate>(userCreate, UserCreate);
}

export function validateUserUpdate(
  userUpdate: UserUpdate,
): ValidationResult<UserUpdate> {
  return validateUser<UserUpdate>(userUpdate, UserUpdate);
}

export function validateUserUpdateToggle(
  userUpdateToggle: UserUpdateToggle,
): ValidationResult<UserUpdateToggle> {
  return validateUser<UserUpdateToggle>(userUpdateToggle, UserUpdateToggle);
}

export function validateUserLogin(
  userLogin: UserLogin,
): ValidationResult<UserLogin> {
  return validateUser<UserLogin>(userLogin, UserLogin);
}

export function validateUser<T>(
  user: T,
  struct: Struct<T>,
): ValidationResult<T> {
  return customValidate<T>(user, struct, (failure) => {
    switch (failure.key) {
      case 'pws':
        failure.message = 'Passwords are not identical, or empty';
        break;
      case 'email':
        failure.message = 'E-Mail address seems invalid';
        break;
      case 'name':
        failure.message = 'Name needs to have at least two characters';
        break;
      default:
    }
    return failure;
  });
}
