import { Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { removeToken } from '../utils/funcs/token';
import Link from 'next/link';
import { useCurrentUser } from '../utils/context/current-user';

export default function Logout() {
  const {
    user: { id, name },
    dispatch,
  } = useCurrentUser();

  const router = useRouter();

  const onLogout = () => {
    router.push('/').then(() => {
      removeToken();
      dispatch({ type: 'LOGOUT' });
    });
  };

  return (
    <>
      <Link href="/users/[id]" as={`/users/${id}`}>
        {`Hi ${name}`}
      </Link>
      <Button style={{ marginLeft: 12 }} danger onClick={onLogout}>
        Logout
      </Button>
    </>
  );
}
