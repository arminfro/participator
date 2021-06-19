import { Menu, Spin } from 'antd';
import React from 'react';
import { useCurrentUser } from '../utils/context/current-user';
import Login from './login';
import Logout from './logout';

interface Props {
  isLoading: boolean;
}

export default function LoginOrLogout({ isLoading }: Props) {
  const { user } = useCurrentUser();

  return (
    <Menu.Item style={{ float: 'right' }}>
      {isLoading ? <Spin /> : user ? <Logout /> : <Login />}
    </Menu.Item>
  );
}
