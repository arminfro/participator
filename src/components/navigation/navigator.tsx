import { Menu } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { isUser, User } from '../../types/user';
import api from '../utils/funcs/api';
import { getToken } from '../utils/funcs/token';
import { useStore } from '../utils/store/context';

/*
 * Populates store with fetching user by token,
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
      if (getToken()) {
        api<User>('get', 'api/users/token-to-user')
          .then((user) => {
            if (user && isUser(user)) {
              console.debug('dispatch LOGIN:', user.name);
              dispatch({ type: 'LOGIN', user });
            } else {
              console.debug('not valid token');
            }
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, [dispatch, userFetched]);

  const selectedKey = () => {
    const pathNameMatch = router.pathname.match(/\/\w+/);
    return pathNameMatch ? pathNameMatch[0] : '/';
  };

  return (
    <>
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
    </>
  );
}
