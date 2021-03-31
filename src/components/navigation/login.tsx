import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';

export default function Login() {
  return (
    <>
      <Button>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Button>
      <Button>
        <Link href="/users/new">
          <a>Register</a>
        </Link>
      </Button>
    </>
  );
}
