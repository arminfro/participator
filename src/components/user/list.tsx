import React, { ReactElement, useState } from 'react';
import { User } from '../../types/user';
import UserCard from './card';
import UserFilterCtrl from './filter-ctrl';

export type UserFilter = (a: User) => boolean;

interface Props {
  users: User[];
  group?: boolean;
  filter?: UserFilter;
}

export default function UserList({
  filter = () => true,
  group = false,
  users,
}: Props): ReactElement {
  const [filterCtl, setFilterCtl] = useState([filter]);
  return (
    <>
      {!group && (
        <>
          <h2>Users</h2>

          <UserFilterCtrl
            setFilter={(filterFunc: UserFilter) => setFilterCtl([filterFunc])}
          />
        </>
      )}
      <div className="ui container cards">
        {users.filter(filterCtl[filterCtl.length - 1]).map((user: User) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </>
  );
}
