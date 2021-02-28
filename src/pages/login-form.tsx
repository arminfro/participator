import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { useUserLogin } from './users/utils/hooks/use-user';
import api, { apiLogin } from './utils/api';
import { useStore } from './utils/store/context';

interface Props {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: Props): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();
  const [showErrors, setShowErrors] = useState(false);
  const [recoverPassword, setRecoverPassword] = useState(false);

  const user = useUserLogin();

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user.validationErrors.length) {
      (recoverPassword ? onRecover : onLogin)();
    } else {
      setShowErrors(true);
    }
  };

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
      <h4>{recoverPassword ? 'Password Recover' : 'Login'}</h4>
      <form className="ui form" onSubmit={onSubmit}>
        <label>E-Mail</label>
        <input
          type="text"
          value={user.get.email}
          onChange={(e) => {
            user.set.email(e.target.value);
          }}
        />
        {!recoverPassword && (
          <>
            <label>Password</label>
            <input
              type="password"
              value={user.get.password}
              onChange={(e) => {
                user.set.password(e.target.value);
              }}
            />
          </>
        )}
        {showErrors && user.validationErrors.length !== 0 && (
          <ul className="ui negative message">
            {user.validationErrors.map((failure) => (
              <li key={failure.key}>{failure.message}</li>
            ))}
          </ul>
        )}
        <button
          disabled={showErrors && !!user.validationErrors.length}
          className="ui button"
        >
          Submit
        </button>
        {!recoverPassword && (
          <a className="pointer" onClick={() => setRecoverPassword(true)}>
            reset Password
          </a>
        )}
      </form>
    </>
  );
}
