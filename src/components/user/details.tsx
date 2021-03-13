import Link from 'next/link';
import Router from 'next/router';
import React, { ReactElement } from 'react';

import { User } from '../../types/user';
import api from '../utils/api';
import { useStore } from '../utils/store/context';
import { removeToken } from '../utils/token';
import UserCard from './card';

interface Props {
  user: User;
}

export default function UserDetails({ user }: Props): ReactElement {
  const { dispatch } = useStore();
  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      api('DELETE', `api/users/${user.id}`, () => {
        dispatch({ type: 'LOGOUT' });
        removeToken();
        Router.push('/');
      });
    }
  };

  return (
    <>
      <h2>{user.name}</h2>
      <UserCard user={user} />
      <Link href="/users" as={`/users`}>
        <button className="ui button">Back</button>
      </Link>
      <Link href="/users/[id]/edit" as={`/users/${user.id}/edit`}>
        <button className="ui button yellow">Edit</button>
      </Link>
      <button className="ui button red" onClick={onDelete}>
        Delete
      </button>
    </>
  );
}
