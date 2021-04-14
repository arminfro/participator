import Router from 'next/router';
import React, { ReactElement } from 'react';
import { User, UserCreate } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
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
    <Form onSubmit={onSubmit} struct={user}>
      <>
        {!passwordResetId && (
          <>
            <FormInputItem label="Username" name="name" />
            <FormInputItem label="E-Mail" name="email" />
          </>
        )}
        <FormInputItem
          label="Password"
          name="pw1"
          inputProps={{ type: 'password' }}
        />
        <FormInputItem
          label="Password reapeat"
          name="pw2"
          inputProps={{ type: 'password' }}
        />
      </>
    </Form>
  );
}
