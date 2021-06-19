import { message } from 'antd';
import React, { ReactElement } from 'react';
import { UserPasswordRecover } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { useUserPasswordRecover } from '../utils/hooks/use-user';

export default function PasswordRecoverForm(): ReactElement {
  const user = useUserPasswordRecover();

  const onRecover = (promise: Promise<any>) =>
    promise.then(() => {
      message.success(
        'Password recovery activated, please see your E-Mail inbox',
      );
    });

  return (
    <Form<UserPasswordRecover> struct={user} onSubmit={onRecover}>
      <FormInputItem name="email" label="E-Mail" />
    </Form>
  );
}
