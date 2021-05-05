import { message } from 'antd';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { UserLogin } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { useUserLogin } from '../utils/hooks/use-user';

interface Props {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: Props): ReactElement {
  const router = useRouter();

  const user = useUserLogin();

  const onLogin = (promise: Promise<UserLogin>) =>
    promise.then(() => {
      router.push(redirectUrl || '/users');
    });

  return (
    <Form<UserLogin> struct={user} onSubmit={onLogin}>
      <FormInputItem name="email" label="E-Mail" />
      <FormInputItem
        inputProps={{ type: 'password' }}
        name="password"
        label="Password"
      />
    </Form>
  );
}
