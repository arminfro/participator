import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import UserList from '../../components/user/list';
import Fetch from '../../components/utils/fetch';

export default function UserIndex(): ReactElement {
  return (
    <Fetch<User[]> url="api/users">
      {(users) => <UserList users={users} />}
    </Fetch>
  );
}
