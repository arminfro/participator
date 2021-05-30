import { Form as AntdForm } from 'antd';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { FormSwitchItem } from '../utils/container/form/switch';
import { useUserUpdate } from '../utils/hooks/use-user';
import UserUpdateAvatar from './update-avatar';

interface Props {
  user: User;
  onCloseDrawer: () => void;
}

export default function UserEditForm({
  user,
  onCloseDrawer,
}: Props): ReactElement {
  const userStruct = useUserUpdate(user.id, user);

  const onSubmit = (promise: Promise<User>) => promise.then(onCloseDrawer);

  return (
    <Form onSubmit={onSubmit} struct={userStruct}>
      <AntdForm.Item label="Avatar">
        <UserUpdateAvatar user={user} />
      </AntdForm.Item>
      <FormInputItem label="Name" name="name" />
      <FormSwitchItem label="Hand up" name="hasHandUp" />
      <FormSwitchItem label="Active" name="active" />
    </Form>
  );
}
