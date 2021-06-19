import { Menu, Spin } from 'antd';
import React from 'react';
import { useStore } from '../utils/store/context';
import Login from './login';
import Logout from './logout';

interface Props {
  isLoading: boolean;
}

export default function LoginOrLogout({ isLoading }: Props) {
  const { store } = useStore();

  return (
    <Menu.Item style={{ float: 'right' }}>
      {isLoading ? <Spin /> : store.user ? <Logout /> : <Login />}
    </Menu.Item>
  );
}
