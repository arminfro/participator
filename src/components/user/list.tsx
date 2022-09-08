import { Card } from 'antd';
import React, { ReactElement, useState } from 'react';
import { User } from '../../types/user';
import UserCard from './card';
import UserFilterCtrl from './filter-ctrl';

export type UserFilter = (a: User) => boolean;

interface Props {
  users: User[];
}

export default function UserList({ users }: Props): ReactElement {
  const [filters, setFilters] = useState<UserFilter[]>([() => true]);

  const filteredUsers = (): User[] => {
    return filters.reduce((acc, filter) => acc.filter(filter), users);
  };

  return (
    <>
      <UserFilterCtrl setFilters={setFilters} />

      {filteredUsers().map((user: User) => (
        <Card.Grid
          key={user.id}
          style={{
            display: 'inline-block',
            maxWidth: '15em',
            minWidth: '9em',
            padding: 3,
            margin: 15,
          }}
        >
          <UserCard user={user} />
        </Card.Grid>
      ))}
    </>
  );
}
