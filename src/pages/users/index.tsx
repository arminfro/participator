import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import UserList from '../../components/user/list';
import Page from '../../components/utils/container/page';
import FetchDynamicImport from '../../components/utils/container/fetch-dynamic-import';

export default function UserIndex(): ReactElement {
  return (
    <Page title="Users">
      <FetchDynamicImport<User[]> url="api/users">
        {(users) => users && <UserList users={users} />}
      </FetchDynamicImport>
    </Page>
  );
}
