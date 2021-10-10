import Router from 'next/router';
import React, { ReactElement } from 'react';
import { User } from '../../types/user';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import { FormItem } from '../utils/container/form/item';
import { useCurrentUser } from '../utils/context/current-user';
import api, { apiLogin } from '../utils/funcs/api';
import { setToken } from '../utils/funcs/token';
import { useUserPasswordUpdate } from '../utils/hooks/use-user';

interface Props {
  passwordResetId: string;
  user: User;
}

export default function PasswordReset(props: Props): ReactElement {
  const user = useUserPasswordUpdate(props.passwordResetId);

  const { dispatch } = useCurrentUser();

  const onSubmit = async () => {
    const password = user.get.pw1;

    const updatedUser = await api<User>(
      'PATCH',
      `api/users/${props.user.id}/password-reset`,
      user.get,
    );

    if (updatedUser) {
      const login = await apiLogin({
        email: props.user.email,
        password,
      });

      dispatch({ type: 'LOGIN', user: login.user });
      setToken(login.access_token);

      Router.push(`/users/${updatedUser.id}`);
    }
  };

  const equalPwFailure = user.validationErrors.find(
    (failure) => failure.refinement === 'equalPws',
  );

  return (
    <Form onSubmit={onSubmit} struct={user}>
      <>
        <FormInputItem
          label="Password"
          name="pw1"
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        <FormInputItem
          label="Password reapeat"
          name="pw2"
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        {equalPwFailure && (
          <FormItem>
            <div className="ant-row">
              <div className="ant-col ant-col-6 ant-form-item-label">
                <div className="ant-form-item-explain ant-form-item-explain-error">
                  {equalPwFailure.message}
                </div>
              </div>
            </div>
          </FormItem>
        )}
      </>
    </Form>
  );
}
