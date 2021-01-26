import React, { useState, ReactElement } from 'react';

import UserCard from './card';
import UserFilterCtrl from './filter-ctrl';
import User from '../../types/user';
import { NextPageContext } from 'next';
import api from '../utils/api';
import getInitialProps from '../utils/get-initial-props';

export type UserFilter = (a: User) => boolean;

interface Props {
  users: User[];
  group?: boolean;
  filter?: UserFilter;
}

export default function Users({
  filter = (a: User) => !!a,
  group = false,
  users,
}: Props): ReactElement {
  const [usersRef, setUsersRef] = useState(users);
  const [filterCtl, setFilterCtl] = useState([filter]);

  const onUpdateUser = (newUser: User): void => {
    const oldUser = usersRef.find((user) => user.id === newUser.id);
    if (oldUser) {
      const index = usersRef.indexOf(oldUser);
      const _users = [...usersRef];
      _users[index] = { ...newUser };
      setUsersRef(_users);
    }
  };

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
        {usersRef.filter(filterCtl[filterCtl.length - 1]).map((user: User) => (
          <UserCard user={user} key={user.id} updateUser={onUpdateUser} />
        ))}
      </div>
    </>
  );
}

Users.getInitialProps = async ({ req, query }: NextPageContext) => {
  const users = await getInitialProps<User[]>(req, query, {
    server: () => query.users,
    client: async () => await api('get', 'api/users'),
  });
  return {
    users,
  };
};
