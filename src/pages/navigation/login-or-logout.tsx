import React from 'react';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';
import Login from './login';
import Logout from './logout';

interface Props {
  isLoading: boolean;
}

export default function LoginOrLogout(props: Props) {
  const { store } = useStore();
  if (props.isLoading) {
    return (
      <span className="item right">
        <LoadingSpinner justSpinner={true} />
      </span>
    );
  }

  return store.user ? <Logout /> : <Login />;
}
