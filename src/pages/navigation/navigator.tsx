import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import User, { isUser } from '../../types/user';
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

  useEffect(() => {
    if (!userFetched) {
      api<User>('get', 'api/users/token-to-user', (user) => {
        setIsLoading(false);
        if (isUser(user)) {
          console.debug('dispatch LOGIN:', user.name);
          dispatch({ type: 'LOGIN', user });
        } else {
          console.error('not valid token');
        }
      });
    }
  }, []);

  console.debug('render navigator');
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
