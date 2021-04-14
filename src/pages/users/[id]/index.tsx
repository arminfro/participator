import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { User } from '../../../types/user';
import UserDetails from '../../../components/user/details';
import Fetch from '../../../components/utils/container/fetch';
import Page from '../../../components/utils/container/page';
import Link from 'next/link';
import { Button } from 'antd';
import api from '../../../components/utils/funcs/api';
import { useStore } from '../../../components/utils/store/context';
import { removeToken } from '../../../components/utils/funcs/token';
import UserEditForm from '../../../components/user/update';
import Drawer from '../../../components/utils/container/drawer';

export default function UserIndex(): ReactElement {
  const router = useRouter();
  const { dispatch } = useStore();

  const onDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      api('DELETE', `api/users/${userId}`, () => {
        dispatch({ type: 'LOGOUT' });
        removeToken();
        router.push('/');
      });
    }
  };

  return (
    <Fetch<User> url={`api/users/${router.query.id}`}>
      {(user) => (
        <Page
          title={user.name}
          extra={[
            <Drawer
              key="edit"
              action="Edit"
              subject={`user ${user.name}`}
              contentWrapperStyle={{ width: 512 }}
            >
              {(onClose: () => void) => (
                <UserEditForm onCloseDrawer={onClose} user={user} />
              )}
            </Drawer>,
            <Button key="delete" danger onClick={() => onDelete(user.id)}>
              Delete
            </Button>,
          ]}
        >
          <UserDetails user={user} />
        </Page>
      )}
    </Fetch>
  );
}
