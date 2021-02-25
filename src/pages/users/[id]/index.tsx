import React from 'react';

import UserCard from '../card';
import { ReactElement } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import api from '../../utils/api';
import { NextPageContext } from 'next';
import getInitialProps from '../../utils/get-initial-props';
import { User } from '../../../types/user';

interface Props {
  user: User;
}

export default function UserItem({ user }: Props): ReactElement {
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

UserItem.getInitialProps = async ({ req, query }: NextPageContext) => {
  const user = await getInitialProps<User>(req, query, {
    server: () => query.users,
    client: async () => await api('get', `api/users/${query.id}`),
  });
  return { user };
};
