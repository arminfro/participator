import { Menu } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { isUser, User } from '../../types/user';
import { useCurrentUser } from '../utils/context/current-user';
import api from '../utils/funcs/api';
import { getToken } from '../utils/funcs/token';

/*
 * Populates store with fetching user by token,
 */
export default function Navigator() {
  const LoginOrLogout = dynamic(() => import('./login-or-logout'), {
    ssr: false,
  });

  const { dispatch, user } = useCurrentUser();

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

  const menuItemStyle = { marginRight: 'auto' };

  return (
    <>
      <Menu
        style={!userFetched ? { justifyContent: 'space-between' } : {}}
        mode="horizontal"
        selectedKeys={[selectedKey()]}
      >
        <Menu.Item style={!userFetched ? menuItemStyle : {}} key="/">
          <Link href="/">Home</Link>
        </Menu.Item>
        {userFetched && (
          <>
            <Menu.Item key="/users">
              <Link href="/users">Users</Link>
            </Menu.Item>
            <Menu.Item style={menuItemStyle} key="/rooms">
              <Link href="/rooms">Rooms</Link>
            </Menu.Item>
          </>
        )}
        <LoginOrLogout isLoading={isLoading} />
      </Menu>
    </>
  );
}
