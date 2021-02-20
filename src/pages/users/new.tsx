import Router from 'next/router';
import React, { ReactElement, SyntheticEvent, useState } from 'react';
import User, { UserCreate } from '../../types/user';
import { validateUserCreate } from '../../types/user.validation';
import api from '../utils/api';
import { useFormValidation } from './utils/hooks/use-form-validation';

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

  const submit = (payload: UserCreate) => {
    api<User>(
      edit ? 'PATCH' : 'POST',
      edit ? `api/users/${userId}` : 'api/users',
      (newUser) => Router.push(`/users/${newUser.id}`),
      payload,
    );
  };

  const [errorList, onValidSubmit] = useFormValidation(
    validateUserCreate,
    submit,
  );

  const userCreate = (): UserCreate => {
    return { name, pws: { pw1, pw2 } };
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    onValidSubmit(userCreate());
  };

  return (
    <>
      <h2>Join Participator</h2>
      <form className="ui form" onSubmit={onSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          value={pw1}
          onChange={(e) => {
            setPw1(e.target.value);
          }}
        />
        <label>Repeat password</label>
        <input
          type="text"
          value={pw2}
          onChange={(e) => {
            setPw2(e.target.value);
          }}
        />
        {errorList}
        <button className="ui button">Submit</button>
      </form>
    </>
  );
}
