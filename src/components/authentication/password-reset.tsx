import { NextPageContext } from 'next';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import UserCreateForm from '../user/create';

interface Props {
  id: string;
  user: User;
}

export default function PasswordReset({ id, user }: Props): ReactElement {
  return (
    <UserCreateForm
      name={user.name}
      email={user.email}
      userId={user.id}
      passwordResetId={id}
    />
  );
}
