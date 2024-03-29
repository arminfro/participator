import Router from 'next/router';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { FormItem } from '../utils/container/form/item';
import { useCurrentUser } from '../utils/context/current-user';
import api, { apiLogin } from '../utils/funcs/api';
import { setToken } from '../utils/funcs/token';
import { useUserCreate } from '../utils/hooks/use-user';

interface Props {
  name?: string;
  email?: string;
  edit?: boolean;
}

export default function UserCreateForm({
  name = '',
  email = '',
}: Props): ReactElement {
  const user = useUserCreate({ name, email, pw1: '', pw2: '' });

  const { dispatch } = useCurrentUser();

  const onSubmit = async () => {
    const password = user.get.pw1;
    const loginProps = {
      email: user.get.email,
      password,
    };

    const createdUser = await api<User>('POST', 'api/users', user.get);

    const login = await apiLogin(loginProps);
    dispatch({ type: 'LOGIN', user: login.user });
    setToken(login.access_token);

    if (createdUser) Router.push(`/users/${createdUser.id}`);
  };

  const equalPwFailure = user.validationErrors.find(
    (failure) => failure.refinement === 'equalPws',
  );

  return (
    <Form onSubmit={onSubmit} struct={user}>
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
