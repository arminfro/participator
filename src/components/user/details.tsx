import Card from 'antd/lib/card';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import useMobile from '../utils/hooks/use-mobile';
import UserCard from './card';

interface Props {
  user: User;
}

export default function UserDetails({ user }: Props): ReactElement {
  const { isMobile } = useMobile();
  return (
    <Card.Grid style={{ width: isMobile ? '100%' : '30%' }} key={user.id}>
      <UserCard user={user} isDetailPage />
    </Card.Grid>
  );
}
