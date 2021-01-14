import { useRouter } from 'next/router';
import React from 'react';
import { useStore } from '../utils/store/context';
import { removeToken } from '../utils/token';

export default function Logout() {
  const { store, dispatch } = useStore();
  const router = useRouter();
  const onLogout = () => {
    removeToken();
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  return (
    <span className="ui button item right">
      Hi {store.user.name}
      <button className="ui button" onClick={onLogout}>
        Logout
      </button>
    </span>
  );
}
