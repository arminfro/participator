import { Struct } from 'superstruct';
import {
  UserCreate,
  UserLogin,
  UserPasswordRecover,
  UserPasswordUpdate,
  UserUpdate,
  UserUpdateToggle,
} from './user';
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

export function validateUserPasswordRecover(
  userPasswordRecover: UserPasswordRecover,
): ValidationResult<UserPasswordRecover> {
  return validateUser<UserPasswordRecover>(
    userPasswordRecover,
    UserPasswordRecover,
  );
}

export function validateUserPasswordUpdate(
  userPasswordUpdate: UserPasswordUpdate,
): ValidationResult<UserPasswordUpdate> {
  return validateUser<UserPasswordUpdate>(
    userPasswordUpdate,
    UserPasswordUpdate,
  );
}

export function validateUser<T>(
  user: T,
  struct: Struct<T>,
): ValidationResult<T> {
  return customValidate<T>(user, struct, (failure) => {
    switch (failure.refinement) {
      case 'equalPws':
        failure.message = 'Passwords are not identical';
        break;
    }
    switch (failure.key) {
      case 'pws':
        failure.message = 'Passwords are not identical, or empty';
        break;
      case 'password':
        failure.message = 'Password is not strong';
        break;
      case 'email':
        failure.message = 'Valid E-Mail address required';
        break;
      case 'name':
        failure.message = 'Name needs to have at least two characters';
        break;
      default:
    }
    return failure;
  });
}
