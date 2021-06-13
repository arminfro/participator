import { Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

import { useStore } from '../utils/store/context';
import { removeToken } from '../utils/funcs/token';
import Link from 'next/link';

export default function Logout() {
  const {
    store: {
      user: { id, name },
    },
    dispatch,
  } = useStore();
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
        <>Hi {name}</>
      </Link>
      <Button danger onClick={onLogout}>
        Logout
      </Button>
    </>
  );
}
