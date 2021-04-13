import { useState } from 'react';
import { User, UserCreate, UserLogin, UserUpdate } from '../../../types/user';
import {
  validateUserCreate,
  validateUserLogin,
  validateUserUpdate,
} from '../../../types/user.validation';
import { ValidationResult } from '../../../types/utils';
import api from '../funcs/api';
import { SetCallback, useStruct, UseStruct } from './use-struct';

export function useUserUpdate(
  userId: number,
  user: UserUpdate,
  withValidation = false,
  autoSync = false,
): UseStruct<UserUpdate> {
  const states = {
    name: useState(user.name),
    hasHandUp: useState(user.hasHandUp),
    active: useState(user.active),
  };

  return useStruct<UserUpdate>({
    states,
    autoValidate: withValidation,
    validator: (user) => validateUserUpdate(user),
    autoSync,
    update: (callback: SetCallback<UserUpdate>, newUser: User) =>
      api<UserUpdate>('PATCH', `api/users/${userId}`, callback, newUser),
  });
}

export function useUserLogin(): UseStruct<UserLogin> {
  const states = {
    email: useState(''),
    password: useState(''),
  };

  return useStruct<UserLogin>({
    states,
    validator: validateUserLogin,
    autoValidate: false,
  });
}

export function useUserCreate(user: UserCreate, withValidation = false) {
  const states = {
    name: useState(user.name),
    email: useState(user.email),
    pw1: useState(user.pw1),
    pw2: useState(user.pw2),
  };
  return useStruct<UserCreate>({
    states,
    autoValidate: withValidation,
    validator: validateUserCreate,
  });
}
