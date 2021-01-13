import React, { ReactElement, useState, SyntheticEvent } from 'react';
import api from './utils/api';
import { setToken } from './utils/token';

interface Props {
  redirectUrl: string;
}

export default function LoginForm({ redirectUrl = '' }: Props): ReactElement {
  const [name, setName] = useState('Joet');
  const [pw, setPw] = useState('hi');

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    api<{ access_token: string }>(
      'POST',
      'login',
      (token) => {
        setToken(token.access_token);
        if (redirectUrl) {
          // Router.push(redirectUrl)
        }
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
          type="text"
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
