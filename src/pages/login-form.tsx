import { useRouter } from 'next/router';
import React, { ReactElement, useState, SyntheticEvent } from 'react';
import { User } from '../types/user';
import api from './utils/api';
import { useStore } from './utils/store/context';
import { setToken } from './utils/token';

interface Props {
  redirectUrl: string;
}

export default function LoginForm({ redirectUrl = '' }: Props): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();
  const [name, setName] = useState('Joey');
  const [pw, setPw] = useState('hi');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    api<{ access_token: string; user: User }>(
      'POST',
      'login',
      ({ access_token, user }) => {
        dispatch({ type: 'LOGIN', user });
        setToken(access_token);
        router.push(redirectUrl || '/users');
      },
      { username: name, password: pw },
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
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
          }}
        />
        <button className="ui button">Submit</button>
      </form>
    </>
  );
}
