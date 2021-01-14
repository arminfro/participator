import Link from 'next/link';
import React from 'react';

export default function Login() {
  return (
    <Link href="/login">
      <a className="item right">Login</a>
    </Link>
  );
}
