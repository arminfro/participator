import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { User } from '../../types/user';
import PasswordReset from '../../components/authentication/password-reset';

interface Props {
  id: string;
  user: User;
}

// todo
export default function PasswordResetSSR(props: Props): ReactElement {
  return <PasswordReset {...props} />;
}

PasswordResetSSR.getInitialProps = ({
  query,
}: NextPageContext & { query: Props }) => query;
