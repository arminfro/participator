import { Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

import { useStore } from '../utils/store/context';
import { removeToken } from '../utils/token';

export default function Logout() {
  const { store, dispatch } = useStore();
  const router = useRouter();
  const onLogout = () => {
    router.push('/').then(() => {
      removeToken();
      dispatch({ type: 'LOGOUT' });
    });
  };

  return (
    <>
      Hi {store.user.name}{' '}
      <Button danger onClick={onLogout}>
        Logout
      </Button>
    </>
  );
}
