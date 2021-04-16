import Router from 'next/router';
import React, { ReactElement } from 'react';
import { User, UserCreate } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { FormItem } from '../utils/container/form/item';
import api, { apiLogin } from '../utils/funcs/api';
import { setToken } from '../utils/funcs/token';
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

  const onSubmit = () =>
    api<User>(
      passwordResetId ? 'PATCH' : 'POST',
      passwordResetId ? `api/users/${userId}/password-reset` : 'api/users',
      passwordResetId ? { ...user.get, passwordResetId } : user.get,
    ).then(async (createdUser: User) => {
      const login = await apiLogin({
        email: user.get.email,
        password: user.get.pw1,
      });
      dispatch({ type: 'LOGIN', user: login.user });
      setToken(login.access_token);
      Router.push(`/users/${createdUser.id}`);
    });

  const equalPwFailure = user.validationErrors.find(
    (failure) => failure.refinement === 'equalPws',
  );

  return (
    <Form onSubmit={onSubmit} struct={user}>
      <>
        {!passwordResetId && (
          <>
            <FormInputItem
              label="Username"
              name="name"
              inputProps={{ autoComplete: 'username' }}
            />
            <FormInputItem
              label="E-Mail"
              name="email"
              inputProps={{ type: 'email' }}
            />
          </>
        )}
        <FormInputItem
          label="Password"
          name="pw1"
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        <FormInputItem
          label="Password reapeat"
          name="pw2"
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        {equalPwFailure && (
          <FormItem>
            <div className="ant-row">
              <div className="ant-col ant-col-6 ant-form-item-label">
                <div className="ant-form-item-explain ant-form-item-explain-error">
                  {equalPwFailure.message}
                </div>
              </div>
            </div>
          </FormItem>
        )}
      </>
    </Form>
  );
}
