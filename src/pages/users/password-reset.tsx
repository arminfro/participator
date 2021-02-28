import { NextPageContext } from 'next';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import getInitialProps from '../utils/get-initial-props';
import UserForm from './new';

interface Props {
  id: string;
  user: User;
}

export default function PasswordReset({ id, user }: Props): ReactElement {
  return (
    <UserForm
      name={user.name}
      email={user.email}
      userId={user.id}
      passwordResetId={id}
    />
  );
}

PasswordReset.getInitialProps = async ({ req, query }: NextPageContext) => {
  const payload = await getInitialProps<User>(req, query, {
    server: () => query,
    client: () => {
      // should be only rendered on the server, just in case
      // user clicks back after resetting password
      window.location.reload();
    },
  });
  return payload;
};
