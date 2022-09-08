import { Button, Popconfirm } from 'antd';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import UserDetails from '../../../components/user/details';
import UserEditForm from '../../../components/user/update';
import Drawer from '../../../components/utils/container/drawer';
import FetchDynamicImport from '../../../components/utils/container/fetch-dynamic-import';
import Page from '../../../components/utils/container/page';
import { useCurrentUser } from '../../../components/utils/context/current-user';
import api from '../../../components/utils/funcs/api';
import { removeToken } from '../../../components/utils/funcs/token';
import { User } from '../../../types/user';

export default function UserIndex(): ReactElement {
  const router = useRouter();
  const { dispatch } = useCurrentUser();

  const onDelete = (userId: number) => {
    api('DELETE', `api/users/${userId}`).then(() => {
      dispatch({ type: 'LOGOUT' });
      removeToken();
      router.push('/');
    });
  };

  return (
    <FetchDynamicImport<User> url={`api/users/${router.query.id}`}>
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
            <Popconfirm
              key="delete"
              title="Are you sure you want to delete your account?"
              onConfirm={() => onDelete(user.id)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>,
          ]}
        >
          <UserDetails user={user} />
        </Page>
      )}
    </FetchDynamicImport>
  );
}
