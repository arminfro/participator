import React, { ReactElement } from 'react';
import UserCreateForm from '../../components/user/create';
import Page from '../../components/utils/container/page';

export default function UserNew(): ReactElement {
  return (
    <Page title="Join Participator">
      <UserCreateForm />
    </Page>
  );
}
