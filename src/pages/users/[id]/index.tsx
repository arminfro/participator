import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { User } from '../../../types/user';
import UserDetails from '../../../components/user/details';
import Fetch from '../../../components/utils/fetch';

export default function UserIndex(): ReactElement {
  const router = useRouter();
  return (
    <Fetch<User> url={`api/users/${router.query.id}`}>
      {(user) => <UserDetails user={user} />}
    </Fetch>
  );
}
