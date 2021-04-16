import { Router } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { noop } from '../../../constants';
import { User, UserCreate, UserLogin, UserUpdate } from '../../../types/user';
import {
  validateUserCreate,
  validateUserLogin,
  validateUserUpdate,
} from '../../../types/user.validation';
import { ValidationResult } from '../../../types/utils';
import api, { apiLogin } from '../funcs/api';
import { setToken } from '../funcs/token';
import { useStore } from '../store/context';
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
    remoteUpdate: async (newUser) => {
      const user = await api<UserUpdate>(
        'PATCH',
        `api/users/${userId}`,
        newUser,
      );
      if (user) return user;
    },
  });
}

export function useUserLogin(): UseStruct<UserLogin> {
  const states = {
    email: useState(''),
    password: useState(''),
  };

  const { dispatch } = useStore();

  return useStruct<UserLogin, User>({
    states,
    validator: validateUserLogin,
    autoValidate: false,
    remoteUpdate: async (newUser) => {
      try {
        const { user, access_token } = await apiLogin(newUser);
        dispatch({ type: 'LOGIN', user });
        setToken(access_token);
      } catch (err) {
        toast.error(err);
        return await Promise.reject(err);
      }
    },
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
