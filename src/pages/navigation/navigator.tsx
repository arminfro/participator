import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useStore } from '../utils/store/context';
import api from '../utils/api';
import User, { isUser } from '../../types/user';

/*
 * Populates store with fetching user by token,
 * api() appends token to request
 */
export default function Navigator() {
  const LoginOrLogout = dynamic(() => import('./login-or-logout'), {
    ssr: false,
  });

  const { dispatch, store } = useStore();
  const userFetched = !!store.user;

  const [isLoading, setIsLoading] = useState(!userFetched);

  console.debug('userFetched', userFetched);

  useEffect(() => {
    if (!userFetched) {
      api<User>('get', 'api/users/token-to-user', (user) => {
        setIsLoading(false);
        if (isUser(user)) {
          dispatch({ type: 'LOGIN', user });
        } else {
          console.error('not valid token');
        }
      });
    }
  }, []);

  return (
    <div className="ui menu">
      <Link href="/">
        <a className="item">Home</a>
      </Link>
      {userFetched && (
        <Link href="/users">
          <a className="item">Users</a>
        </Link>
      )}
      <LoginOrLogout isLoading={isLoading} />
    </div>
  );
}
