import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import UserEditForm from '../../../components/user/update';
import Fetch from '../../../components/utils/container/fetch';
import { User } from '../../../types/user';

export default function UserEdit(): ReactElement {
  const router = useRouter();
  return (
    <Fetch<User> url={`api/users/${router.query.id}`}>
      {(user) => <UserEditForm user={user} />}
    </Fetch>
  );
}
