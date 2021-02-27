import Link from 'next/link';
import React from 'react';

export default function Login() {
  return (
    <div className="menu right">
      <Link href="/login">
        <a className="item">Login</a>
      </Link>
      <Link href="/users/new">
        <a className="item">Register</a>
      </Link>
    </div>
  );
}
