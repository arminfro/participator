import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent, useState } from 'react';

import { apiLogin } from './utils/api';
import { useStore } from './utils/store/context';

interface Props {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: Props): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();
  const [error, setError] = useState(false);
  const [name, setName] = useState('Joey');
  const [password, setPassword] = useState('hi');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    apiLogin(
      dispatch,
      { username: name, password },
      () => router.push(redirectUrl || '/users'),
      () => {
        setError(true);
        setPassword('');
      },
    );
  };

  return (
    <>
      <h4>Login</h4>
      <form className="ui form" onSubmit={onSubmit}>
        <label>Benutzername</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>Passwort</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {error && <p className="ui negative message">Login failed</p>}
        <button className="ui button">Submit</button>
      </form>
    </>
  );
}
