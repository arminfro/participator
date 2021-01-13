import React from 'react';
import Link from 'next/link';
import { removeToken } from '../utils/token';
import { useRouter } from 'next/router';

export default function Navigator() {
  const router = useRouter();

  const onLogout = () => {
    removeToken();
    router.push('/');
  };

  return (
    <div className="ui menu">
      <Link href="/">
        <a className="item">Home</a>
      </Link>
      <Link href="/users">
        <a className="item">Users</a>
      </Link>
      {false ? (
        <button onClick={onLogout} className="ui button item right">
          Logout
        </button>
      ) : (
        <Link href="/login">
          <a className="item right">Login</a>
        </Link>
      )}
    </div>
  );
}
