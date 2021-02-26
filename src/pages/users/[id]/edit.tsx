import { NextPageContext } from 'next';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { User, UserUpdateToggleKeys } from '../../../types/user';
import api from '../../utils/api';
import getInitialProps from '../../utils/get-initial-props';
import { useUserUpdate } from '../utils/hooks/use-user';

interface Props {
  user: User;
}

export default function UserEditForm(props: Props): ReactElement {
  const user = useUserUpdate(props.user.id, props.user, true, true);

  return (
    <div className="ui segment">
      <h4 className="ui top attached block header">Edit User</h4>
      <div className="ui section divider"></div>
      <form className="ui form" style={{ marginTop: 0 }}>
        <label>Benutzername</label>
        <input
          type="text"
          value={user.get.name}
          onChange={(e) => {
            user.set.name(e.target.value, true);
          }}
        />
        {['hasHandUp', 'randomGroup', 'active'].map(
          (attr: UserUpdateToggleKeys) => (
            <div key={attr} className="ui segment">
              <div className="field">
                <div className="ui toggle checkbox">
                  <input
                    type="checkbox"
                    onChange={(e) => user.set[attr](e.target.checked, true)}
                    checked={user.get[attr]}
                  />
                  <label>{attr}</label>
                </div>
              </div>
            </div>
          ),
        )}
        {user.validationErrors.length !== 0 && (
          <ul className="ui negative message">
            {user.validationErrors.map((failure) => (
              <li key={failure.key}>{failure.message}</li>
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
    server: () => query.user,
    client: async () => await api('get', `api/users/${query.id}`),
  });
  return { user };
};
