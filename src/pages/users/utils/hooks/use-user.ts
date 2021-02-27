import { useState } from 'react';
import {
  User,
  UserCreate,
  UserLogin,
  UserUpdate,
} from '../../../../types/user';
import {
  validateUserCreate,
  validateUserLogin,
  validateUserUpdate,
} from '../../../../types/user.validation';
import { ValidationResult } from '../../../../types/utils';
import api from '../../../utils/api';
import { SetCallback, useStruct, UseStructWithValidation } from './use-struct';

export function useUserUpdate(
  userId: number,
  user: UserUpdate,
  withValidation = false,
  autoSync = false,
): UseStructWithValidation<UserUpdate> {
  const name = useState(user.name);
  const hasHandUp = useState(user.hasHandUp);
  const randomGroup = useState(user.randomGroup);
  const active = useState(user.active);

  return useStruct<UserUpdate>(
    {
      name,
      hasHandUp,
      randomGroup,
      active,
    },
    withValidation && ((user) => validateUserUpdate(user)),
    autoSync &&
      ((callback: SetCallback<UserUpdate>, newUser: User) =>
        api<UserUpdate>('PATCH', `api/users/${userId}`, callback, newUser)),
  );
}

export function useUserLogin(): UseStructWithValidation<UserLogin> {
  const email = useState('');
  const password = useState('');

  return useStruct<UserLogin>(
    { email, password },
    (user) => validateUserLogin({ email: user.email, password: user.password }),
    false,
  );
}

export function useUserCreate(user: UserCreate, withValidation = false) {
  const name = useState(user.name);
  const email = useState(user.email);
  const pw1 = useState(user.pws.pw1);
  const pw2 = useState(user.pws.pw2);
  return useStruct<{ name: string; email: string; pw1: string; pw2: string }>(
    { name, email, pw1, pw2 },
    withValidation &&
      ((user) => {
        const validationResult = validateUserCreate({
          name: user.name,
          email: user.email,
          pws: { pw1: user.pw1, pw2: user.pw2 },
        });
        return validationResult as ValidationResult<{
          name: string;
          email: string;
          pw1: string;
          pw2: string;
        }>;
      }),
    false,
  );
}
