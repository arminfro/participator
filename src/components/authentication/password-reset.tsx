import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import UserCreateForm from '../user/create';
import Page from '../utils/container/page';

interface Props {
  id: string;
  user: User;
}

export default function PasswordReset({ id, user }: Props): ReactElement {
  return (
    <Page title="Password reset">
      <UserCreateForm
        name={user.name}
        email={user.email}
        userId={user.id}
        passwordResetId={id}
      />
    </Page>
  );
}
