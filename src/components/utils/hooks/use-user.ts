import { message } from 'antd';
import { pick } from 'lodash';
import { useState } from 'react';
import {
  User,
  UserCreate,
  UserLogin,
  UserPasswordRecover,
  UserUpdate,
} from '../../../types/user';
import {
  validateUserCreate,
  validateUserLogin,
  validateUserPasswordRecover,
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
        message.success(`Login success. Welcome ${user.name}`);
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  });
}

export function useUserPasswordRecover(): UseStruct<UserPasswordRecover> {
  const initialValues: UserPasswordRecover = {
    email: '',
  };
  const states = {
    email: useState(initialValues.email),
  };

  return useStruct<UserPasswordRecover, User>({
    states,
    validator: validateUserPasswordRecover,
    initialValues,
    remoteUpdate: async (user) => api('post', 'login/password/recover', user),
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
