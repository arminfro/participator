import { Divider } from 'antd';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { toast } from 'react-toastify';
import { UserLogin } from '../../types/user';
import FormContainer from '../utils/container/form';
import api, { apiLogin } from '../utils/funcs/api';
import { useUserLogin } from '../utils/hooks/use-user';
import { useStore } from '../utils/store/context';

interface Props {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: Props): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();
  const [recoverPassword, setRecoverPassword] = useState(false);

  const user = useUserLogin();

  const onRecover = () => {
    api(
      'post',
      'login/password/recover',
      () => {
        toast.success(
          'Password recovery activated, please see your E-Mail inbox',
        );
        setRecoverPassword(false);
      },
      { email: user.get.email },
    );
  };

  const onLogin = () => {
    apiLogin(
      dispatch,
      user.get,
      () => router.push(redirectUrl || '/users'),
      () => {
        toast.error('Login failed');
        user.set.password('');
      },
    );
  };

  return (
    <>
      <Divider>
        <h1>{recoverPassword ? 'Password Recover' : 'Login'}</h1>
      </Divider>
      <FormContainer<UserLogin>
        struct={user}
        onSubmit={recoverPassword ? onRecover : onLogin}
        items={[
          { type: 'input', label: 'E-Mail', name: 'email' },
          !recoverPassword && {
            type: 'input',
            label: 'Password',
            name: 'password',
          },
        ]}
      />
      {recoverPassword ? (
        <a onClick={() => setRecoverPassword(false)}>Login</a>
      ) : (
        <a onClick={() => setRecoverPassword(true)}>Password recover</a>
      )}
    </>
  );
}
