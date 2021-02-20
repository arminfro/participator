import Router from 'next/router';
import React, { ReactElement, SyntheticEvent, useState } from 'react';
import User, { UserCreate } from '../../types/user';
import { validateUserCreate } from '../../types/user.validation';
import api from '../utils/api';

interface Props {
  userName?: string;
  edit?: boolean;
  userId?: number;
}

export default function UserForm({
  userName = 'Joe',
  userId,
  edit = false,
}: Props): ReactElement {
  const [name, setName] = useState(userName);
  const [pw1, setPw1] = useState('hi');
  const [pw2, setPw2] = useState('hi');
  const [formError, setFormError] = useState<string[]>([]);

  const userCreate = (): UserCreate => {
    return { name, pws: { pw1, pw2 } };
  };

  const submit = () => {
    api<User>(
      edit ? 'PATCH' : 'POST',
      edit ? `api/users/${userId}` : 'api/users',
      (newUser) => Router.push(`/users/${newUser.id}`),
      userCreate(),
    );
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const [errs, validUserCreate] = validateUserCreate(userCreate());
    if (validUserCreate) {
      submit();
    } else {
      setFormError(errs.map((failure) => failure.message));
    }
  };

  return (
    <>
      <h2>Join Participator</h2>
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
          value={pw1}
          onChange={(e) => {
            setPw1(e.target.value);
          }}
        />
        <label>Passwort wiederholen</label>
        <input
          type="text"
          value={pw2}
          onChange={(e) => {
            setPw2(e.target.value);
          }}
        />
        {formError.length !== 0 && (
          <ul className="ui negative message">
            {formError.map((err: string) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        <button className="ui button">Submit</button>
      </form>
    </>
  );
}
