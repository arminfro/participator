import React, { ReactElement, SyntheticEvent, useState } from 'react';
import Router from 'next/router';
import { User, UserCreate } from '../../types/user';
import api, { apiLogin } from '../utils/api';
import { useUserCreate } from './utils/hooks/use-user';
import { useStore } from '../utils/store/context';

interface Props {
  userName?: string;
  edit?: boolean;
  userId?: number;
}

export default function UserForm({
  userName = 'Joe',
  userId,
  edit = false, // todo, edit isn't used
}: Props): ReactElement {
  const user = useUserCreate(
    { name: userName, pws: { pw1: 'hi', pw2: 'hi' } },
    true,
  );

  const { dispatch } = useStore();

  const [showErrors, setShowErrors] = useState(false);

  const submit = (payload: UserCreate) => {
    api<User>(
      edit ? 'PATCH' : 'POST',
      edit ? `api/users/${userId}` : 'api/users',
      (createdUser: User) =>
        apiLogin(
          dispatch,
          { username: createdUser.name, password: payload.pws.pw1 },
          () => {
            Router.push(`/users/${createdUser.id}`);
          },
        ),
      payload,
    );
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (user.validationErrors.length) {
      setShowErrors(true);
    } else {
      submit({
        name: user.get.name,
        pws: { pw1: user.get.pw1, pw2: user.get.pw2 },
      });
    }
  };

  return (
    <>
      <h2>Join Participator</h2>
      <form className="ui form" onSubmit={onSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={user.get.name}
          onChange={(e) => user.set.name(e.target.value)}
        />
        <label>Password</label>
        <input
          type="text"
          value={user.get.pw1}
          onChange={(e) => user.set.pw1(e.target.value)}
        />
        <label>Repeat password</label>
        <input
          type="text"
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
