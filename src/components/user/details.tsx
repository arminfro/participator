import Card from 'antd/lib/card';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import UserCard from './card';

interface Props {
  user: User;
}

export default function UserDetails({ user }: Props): ReactElement {
  return (
    <Card.Grid key={user.id} style={{ maxWidth: '30em', minWidth: '15' }}>
      <UserCard user={user} />
    </Card.Grid>
  );
}
