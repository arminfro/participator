import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { toast } from 'react-toastify';
import { UserLogin } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import Page from '../utils/container/page';
import api, { apiLogin } from '../utils/funcs/api';
import { useUserLogin } from '../utils/hooks/use-user';
import { useStore } from '../utils/store/context';

interface Props {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: Props): ReactElement {
  const router = useRouter();
  const [recoverPassword, setRecoverPassword] = useState(false);

  const user = useUserLogin();

  const onRecover = () => {
    api('post', 'login/password/recover', { email: user.get.email }).then(
      () => {
        toast.success(
          'Password recovery activated, please see your E-Mail inbox',
        );
        setRecoverPassword(false);
      },
    );
  };

  const onLogin = (promise: Promise<UserLogin>) =>
    promise
      .then(() => {
        router.push(redirectUrl || '/users');
      })
      .catch(() => user.set.password(''));

  return (
    <Page
      title={recoverPassword ? 'Password Recover' : 'Login'}
      extra={[
        recoverPassword ? (
          <a key="login" onClick={() => setRecoverPassword(false)}>
            Login
          </a>
        ) : (
          <a key="recover" onClick={() => setRecoverPassword(true)}>
            Password recover
          </a>
        ),
      ]}
    >
      <Form<UserLogin> struct={user} onSubmit={onLogin}>
        <FormInputItem name="email" label="E-Mail" />
        {!recoverPassword && (
          <FormInputItem
            inputProps={{ type: 'password' }}
            name="password"
            label="Password"
          />
        )}
      </Form>
    </Page>
  );
}
