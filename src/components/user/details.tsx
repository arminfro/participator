import { Button } from 'antd';
import Card from 'antd/lib/card';
import Link from 'next/link';
import Router from 'next/router';
import React, { ReactElement } from 'react';

import { User } from '../../types/user';
import api from '../utils/funcs/api';
import { useStore } from '../utils/store/context';
import { removeToken } from '../utils/funcs/token';
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
      <Card.Grid key={user.id} style={{ maxWidth: '30em', minWidth: '15' }}>
        <UserCard user={user} />
      </Card.Grid>
      <Link href="/users" as={`/users`}>
        <Button>Back</Button>
      </Link>
      <Link href="/users/[id]/edit" as={`/users/${user.id}/edit`}>
        <Button>Edit</Button>
      </Link>
      <Button danger onClick={onDelete}>
        Delete
      </Button>
    </>
  );
}
