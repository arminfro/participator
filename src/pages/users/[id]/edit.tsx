import React, { ReactElement } from 'react';

import User, {
  userEditBooleanAttrs,
  UserEditBooleanAttrs,
} from '../../../types/user';
import useUser from '../use-user';
import Link from 'next/link';
import { NextPageContext } from 'next';
import getInitialProps from '../../utils/get-initial-props';
import api from '../../utils/api';

interface Props {
  user: User;
}

export default function UserEditForm({ user }: Props): ReactElement {
  const stateUser = useUser(user);

  return (
    <div className="ui segment">
      <h4 className="ui top attached block header">Edit User</h4>
      <div className="ui section divider"></div>
      <form className="ui form" style={{ marginTop: 0 }}>
        <label>Benutzername</label>
        <input
          type="text"
          value={stateUser.get.name}
          onChange={(e) => {
            stateUser.set.name(e.target.value, true);
          }}
        />
        {userEditBooleanAttrs.map((attr: UserEditBooleanAttrs) => (
          <div key={attr} className="ui segment">
            <div className="field">
              <div className="ui toggle checkbox">
                <input
                  type="checkbox"
                  onChange={(e) => stateUser.set[attr](e.target.checked, true)}
                  checked={stateUser.get[attr]}
                />
                <label>{attr}</label>
              </div>
            </div>
          </div>
        ))}
        {stateUser.get.validationErrors.length !== 0 && (
          <ul className="ui negative message">
            {stateUser.get.validationErrors.map((err: string) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </form>
      <div className="ui section divider"></div>
      <Link href="/users" as={`/users`}>
        <button className="ui button">Back</button>
      </Link>
    </div>
  );
}

UserEditForm.getInitialProps = async ({ req, query }: NextPageContext) => {
  const user = await getInitialProps<User>(req, query, {
    server: () => query.users,
    client: async () => await api('get', `api/users/${query.id}`),
  });
  return { user };
};
