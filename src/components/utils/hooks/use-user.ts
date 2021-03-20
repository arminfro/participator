import { useState } from 'react';
import { User, UserCreate, UserLogin, UserUpdate } from '../../../types/user';
import {
  validateUserCreate,
  validateUserLogin,
  validateUserUpdate,
} from '../../../types/user.validation';
import { ValidationResult } from '../../../types/utils';
import api from '../api';
import { SetCallback, useStruct, UseStructWithValidation } from './use-struct';

export function useUserUpdate(
  userId: number,
  user: UserUpdate,
  withValidation = false,
  autoSync = false,
): UseStructWithValidation<UserUpdate> {
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

export function useUserLogin(): UseStructWithValidation<UserLogin> {
  const states = {
    email: useState(''),
    password: useState(''),
  };

  return useStruct<UserLogin>({
    states,
    validator: (user) =>
      validateUserLogin({ email: user.email, password: user.password }),
    autoValidate: false,
  });
}

interface UseUserCreate {
  name: string;
  email: string;
  pw1: string;
  pw2: string;
}
export function useUserCreate(user: UserCreate, withValidation = false) {
  const states = {
    name: useState(user.name),
    email: useState(user.email),
    pw1: useState(user.pws.pw1),
    pw2: useState(user.pws.pw2),
  };
  return useStruct<UseUserCreate>({
    states,
    autoValidate: withValidation,
    validator: (user) => {
      const validationResult = validateUserCreate({
        name: user.name,
        email: user.email,
        pws: { pw1: user.pw1, pw2: user.pw2 },
      });
      return validationResult as ValidationResult<UseUserCreate>;
    },
  });
}
