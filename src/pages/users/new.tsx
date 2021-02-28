import React, { ReactElement, SyntheticEvent, useState } from 'react';
import Router from 'next/router';
import { User, UserCreate } from '../../types/user';
import api, { apiLogin } from '../utils/api';
import { useUserCreate } from './utils/hooks/use-user';
import { useStore } from '../utils/store/context';

interface Props {
  name?: string;
  email?: string;
  edit?: boolean;
  userId?: number;
  passwordResetId?: string;
}

export default function UserForm({
  name = '',
  email = '',
  userId = null,
  passwordResetId = null,
}: Props): ReactElement {
  const user = useUserCreate(
    { name, email, pws: { pw1: 'hi', pw2: 'hi' } },
    true,
  );

  const { dispatch } = useStore();

  const [showErrors, setShowErrors] = useState(false);

  const submit = (userCreate: UserCreate) => {
    api<User>(
      passwordResetId ? 'PATCH' : 'POST',
      passwordResetId ? `api/users/${userId}/password-reset` : 'api/users',
      (createdUser: User) => {
        console.log('createdUser', createdUser);
        return apiLogin(
          dispatch,
          { email: userCreate.email, password: userCreate.pws.pw1 },
          () => {
            Router.push(`/users/${createdUser.id}`);
          },
        );
      },
      { ...userCreate, passwordResetId },
    );
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (user.validationErrors.length) {
      setShowErrors(true);
    } else {
      submit({
        name: user.get.name,
        email: user.get.email,
        pws: { pw1: user.get.pw1, pw2: user.get.pw2 },
      });
    }
  };

  return (
    <>
      <h2>{passwordResetId ? 'Reset Password' : 'Join Participator'}</h2>
      <form className="ui form" onSubmit={onSubmit}>
        {!passwordResetId && (
          <>
            <label>Username</label>
            <input
              type="text"
              value={user.get.name}
              onChange={(e) => user.set.name(e.target.value)}
            />
            <label>E-Mail</label>
            <input
              type="email"
              value={user.get.email}
              onChange={(e) => user.set.email(e.target.value)}
            />
          </>
        )}
        <label>Password</label>
        <input
          type="password"
          value={user.get.pw1}
          onChange={(e) => user.set.pw1(e.target.value)}
        />
        <label>Repeat password</label>
        <input
          type="password"
          value={user.get.pw2}
          onChange={(e) => user.set.pw2(e.target.value)}
        />
        {showErrors && user.validationErrors.length !== 0 && (
          <ul className="ui negative message">
            {user.validationErrors.map((failure) => (
              <li key={failure.key}>{failure.message}</li>
            ))}
          </ul>
        )}
        <button
          disabled={showErrors && user.validationErrors.length > 0}
          className="ui button"
        >
          Submit
        </button>
      </form>
    </>
  );
}
