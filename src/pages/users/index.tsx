import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import UserList from '../../components/user/list';
import Fetch from '../../components/utils/container/fetch';
import Page from '../../components/utils/container/page';

export default function UserIndex(): ReactElement {
  return (
    <Page title="Users">
      <Fetch<User[]> url="api/users">
        {(users) => <UserList users={users} />}
      </Fetch>
    </Page>
  );
}
