import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { FormSwitchItem } from '../utils/container/form/switch';
import { useUserUpdate } from '../utils/hooks/use-user';

interface Props {
  user: User;
  onCloseDrawer: () => void;
}

export default function UserEditForm(props: Props): ReactElement {
  const user = useUserUpdate(props.user.id, props.user);

  const onSubmit = (promise: Promise<User>) =>
    promise.then(props.onCloseDrawer);

  return (
    <Form onSubmit={onSubmit} struct={user}>
      <FormInputItem label="User name" name="name" />
      <FormSwitchItem label="Hand up" name="hasHandUp" />
      <FormSwitchItem label="Active" name="active" />
    </Form>
  );
}
