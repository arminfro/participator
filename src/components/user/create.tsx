import React, { ReactElement, SyntheticEvent, useState } from 'react';
import Router from 'next/router';

import { User, UserCreate } from '../../types/user';
import api, { apiLogin } from '../utils/funcs/api';
import { useUserCreate } from '../utils/hooks/use-user';
import { useStore } from '../utils/store/context';
import Page from '../utils/container/page';
import FormContainer from '../utils/container/form';

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
    <Page title={passwordResetId ? 'Reset Password' : 'Join Participator'}>
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
          { type: 'input', label: 'Password', name: 'pw1' },
          { type: 'input', label: 'Password repeat', name: 'pw2' },
        ]}
      />
    </Page>
  );
}
