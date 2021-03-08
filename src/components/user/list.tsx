import React, { ReactElement, useState } from 'react';
import { User } from '../../types/user';
import UserCard from './card';
import UserFilterCtrl from './filter-ctrl';

export type UserFilter = (a: User) => boolean;

interface Props {
  users: User[];
}

export default function UserList({ users }: Props): ReactElement {
  const [filterCtl, setFilterCtl] = useState<UserFilter[]>([() => true]);
  return (
    <>
      <h2 className="ui dividing header">Users</h2>

      <UserFilterCtrl
        setFilter={(filterFunc: UserFilter) => setFilterCtl([filterFunc])}
      />
      <div className="ui container cards">
        {users.filter(filterCtl[filterCtl.length - 1]).map((user: User) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </>
  );
}
