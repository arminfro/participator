import Router from 'next/router';
import React, { ReactElement } from 'react';
import { User, UserCreate } from '../../types/user';
import FormContainer from '../utils/container/form';
import api, { apiLogin } from '../utils/funcs/api';
import { useUserCreate } from '../utils/hooks/use-user';
import { useStore } from '../utils/store/context';

interface Props {
  name?: string;
  email?: string;
  edit?: boolean;
  userId?: number;
  passwordResetId?: string;
}

export default function UserCreateForm({
  name = '',
  email = '',
  userId = null,
  passwordResetId = null,
}: Props): ReactElement {
  const user = useUserCreate({ name, email, pw1: '', pw2: '' }, true);

  const { dispatch } = useStore();

  const onSubmit = (userCreate: UserCreate) => {
    api<User>(
      passwordResetId ? 'PATCH' : 'POST',
      passwordResetId ? `api/users/${userId}/password-reset` : 'api/users',
      (createdUser: User) => {
        console.log('createdUser', createdUser);
        return apiLogin(
          dispatch,
          { email: userCreate.email, password: userCreate.pw1 },
          () => {
            Router.push(`/users/${createdUser.id}`);
          },
        );
      },
      passwordResetId ? { ...userCreate, passwordResetId } : userCreate,
    );
  };

  return (
    <FormContainer
      onSubmit={onSubmit}
      struct={user}
      items={[
        !passwordResetId && {
          type: 'input',
          label: 'Username',
          name: 'name',
        },
        !passwordResetId && { type: 'input', label: 'E-Mail', name: 'email' },
        {
          type: 'input',
          inputProps: { type: 'password' },
          label: 'Password',
          name: 'pw1',
        },
        {
          type: 'input',
          inputProps: { type: 'password' },
          label: 'Password repeat',
          name: 'pw2',
        },
      ]}
    />
  );
}
