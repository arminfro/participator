import { useRouter } from 'next/router';
import React, { ReactElement, useState, SyntheticEvent } from 'react';
import { isUser, User } from '../types/user';
import api from './utils/api';
import { useStore } from './utils/store/context';
import { setToken } from './utils/token';

interface Props {
  redirectUrl: string;
}

export default function LoginForm({ redirectUrl = '' }: Props): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();
  const [error, setError] = useState(false);
  const [name, setName] = useState('Joey');
  const [password, setPassword] = useState('hi');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    api<{ access_token: string; user: User }>(
      'POST',
      'login',
      ({ access_token, user }) => {
        console.log('user in login callback', user, access_token);
        if (access_token && isUser(user)) {
          dispatch({ type: 'LOGIN', user });
          setToken(access_token);
          router.push(redirectUrl || '/users');
        } else {
          setError(true);
          setPassword('');
        }
      },
      { username: name, password },
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
