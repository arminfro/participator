import React, { ReactElement, useState } from 'react';
import LoginForm from '../components/authentication/login-form';
import PasswordRecoverForm from '../components/authentication/password-recover-form';
import Page from '../components/utils/container/page';

export default function LoginFormSsr(): ReactElement {
  const [recoverPassword, setRecoverPassword] = useState(false);

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
      {recoverPassword ? <PasswordRecoverForm /> : <LoginForm />}
    </Page>
  );
}
