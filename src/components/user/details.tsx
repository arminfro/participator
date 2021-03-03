import Link from 'next/link';
import Router from 'next/router';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import api from '../utils/api';
import UserCard from './card';

interface Props {
  user: User;
}

export default function UserDetails({ user }: Props): ReactElement {
  const onDelete = () => {
    // if (window.confirm('Sure?')) {
    api('DELETE', `api/users/${user.id}`, () => {
      Router.push('/users');
    });
    // }
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
