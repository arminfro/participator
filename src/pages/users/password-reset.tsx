import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { User } from '../../types/user';
import PasswordReset from '../../components/authentication/password-reset';
import Page from '../../components/utils/container/page';

interface Props {
  passwordResetId: string;
  user: User;
}

export default function PasswordResetSSR(props: Props): ReactElement {
  return (
    <Page title="Password reset">
      <PasswordReset {...props} />
    </Page>
  );
}

PasswordResetSSR.getInitialProps = ({
  query,
}: NextPageContext & { query: Props & { user: string } }) => ({
  ...query,
  user: JSON.parse(query.user),
});
