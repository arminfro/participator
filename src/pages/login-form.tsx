import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent, useState } from 'react';
import { useUserLogin } from './users/utils/hooks/use-user';
import api, { apiLogin } from './utils/api';
import { useStore } from './utils/store/context';

interface Props {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: Props): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();
  const [error, setError] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  const user = useUserLogin();

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    (resetPassword ? onReset : onLogin)();
  };

  const onReset = () => {
    api(
      'post',
      'password-recover',
      () => {
        // todo, send notification
        setResetPassword(false);
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
        setError(true);
        user.set.password('');
      },
    );
  };

  return (
    <>
      <h4>{resetPassword ? 'Password Recover' : 'Login'}</h4>
      <form className="ui form" onSubmit={onSubmit}>
        <label>E-Mail</label>
        <input
          type="email"
          value={user.get.email}
          onChange={(e) => {
            user.set.email(e.target.value);
          }}
        />
        {!resetPassword && (
          <>
            <label>Password</label>
            <input
              type="password"
              value={user.get.password}
              onChange={(e) => {
                user.set.password(e.target.value);
              }}
            />
            {error && <p className="ui negative message">Login failed</p>}
          </>
        )}
        <button className="ui button">Submit</button>
        {!resetPassword && (
          <a className="pointer" onClick={() => setResetPassword(true)}>
            reset Password
          </a>
        )}
      </form>
    </>
  );
}
