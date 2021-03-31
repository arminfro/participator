import { Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { isUser, User } from '../../types/user';
import api from '../utils/api';
import { useStore } from '../utils/store/context';

/*
 * Populates store with fetching user by token,
 * api() appends token to request
 */
export default function Navigator() {
  const LoginOrLogout = dynamic(() => import('./login-or-logout'), {
    ssr: false,
  });

  const {
    dispatch,
    store: { user },
  } = useStore();

  const userFetched = !!user;

  const [isLoading, setIsLoading] = useState(!userFetched);
  const router = useRouter();

  useEffect(() => {
    if (!userFetched) {
      api<User>('get', 'api/users/token-to-user', (user) => {
        if (isUser(user)) {
          console.debug('dispatch LOGIN:', user.name);
          dispatch({ type: 'LOGIN', user });
        } else {
          console.error('not valid token');
        }
      }).finally(() => setIsLoading(false));
    }
  }, [dispatch, userFetched]);

  const selectedKey = () => {
    const pathNameMatch = router.pathname.match(/\/\w+/);
    return pathNameMatch ? pathNameMatch[0] : '/';
  };

  return (
    <Header>
      <Menu mode="horizontal" selectedKeys={[selectedKey()]}>
        <Menu.Item key="/">
          <Link href="/">Home</Link>
        </Menu.Item>
        {userFetched && (
          <>
            <Menu.Item key="/users">
              <Link href="/users">Users</Link>
            </Menu.Item>
            <Menu.Item key="/rooms">
              <Link href="/rooms">Rooms</Link>
            </Menu.Item>
          </>
        )}
        <LoginOrLogout isLoading={isLoading} />
      </Menu>
    </Header>
  );
}
