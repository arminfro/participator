import { pick } from 'lodash';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, UserCreate, UserLogin, UserUpdate } from '../../../types/user';
import {
  validateUserCreate,
  validateUserLogin,
  validateUserUpdate,
} from '../../../types/user.validation';
import api, { apiLogin } from '../funcs/api';
import { setToken } from '../funcs/token';
import { useStore } from '../store/context';
import { useStruct, UseStruct } from './use-struct';

export function useUserUpdate(
  userId: number,
  user: UserUpdate,
  autoSync = false,
): UseStruct<UserUpdate> {
  const states = {
    name: useState(user.name),
    hasHandUp: useState(user.hasHandUp),
    active: useState(user.active),
  };

  return useStruct<UserUpdate>({
    states,
    validator: (user) => validateUserUpdate(user),
    autoSync,
    isEdit: true,
    initialValues: pick(user, 'name', 'hasHandUp', 'active'),
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
  const initialValues: UserLogin = {
    email: '',
    password: '',
  };
  const states = {
    email: useState(initialValues.email),
    password: useState(initialValues.password),
  };

  const { dispatch } = useStore();

  return useStruct<UserLogin, User>({
    states,
    validator: validateUserLogin,
    initialValues,
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

export function useUserCreate(user: UserCreate) {
  const states = {
    name: useState(user.name),
    email: useState(user.email),
    pw1: useState(user.pw1),
    pw2: useState(user.pw2),
  };
  return useStruct<UserCreate>({
    initialValues: pick(user, 'name', 'email', 'pw1', 'pw2'),
    states,
    validator: validateUserCreate,
  });
}
