import Link from 'next/link';
import React, { ReactElement } from 'react';
import User, { UserUpdateToggleKeys } from '../../types/user';
import useUser from './utils/use-user';

const iconStyles = {
  cursor: 'pointer',
};

const onlineColorStyle = {
  color: 'green',
};

const offlineColorStyle = {
  color: 'black',
};

export interface Props {
  user: User;
  updateUser?: (user: User) => void;
}

export default function UserCard({ user, updateUser }: Props): ReactElement {
  const stateUser = useUser(user);
  const onToggle = (attr: UserUpdateToggleKeys) => {
    const newUser = stateUser.set[attr](!stateUser.get[attr], true);
    updateUser && updateUser(newUser);
  };

  const stylesForIcon = (attr: UserUpdateToggleKeys) => {
    const stateStyle = stateUser.get[attr]
      ? onlineColorStyle
      : offlineColorStyle;
    return { ...iconStyles, ...stateStyle };
  };

  return (
    <Link href={`/users/[id]`} as={`/users/${user.id}`}>
      <div className="ui card" style={{ width: 120 }}>
        <div className="image">
          <img
            alt=""
            src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png"
            style={{ height: 100 }}
          />
        </div>
        <div
          className="content"
          style={{ margin: 'auto' }}
          onClick={(e) => e.preventDefault()}
        >
          <i
            title="Toggle Online / Offline"
            className="cloud icon"
            style={stylesForIcon('active')}
            onClick={() => onToggle('active')}
          />
          <i
            title="Toggle Hand up / down"
            className="hand point up outline icon"
            style={stylesForIcon('hasHandUp')}
            onClick={() => onToggle('hasHandUp')}
          />
          <i
            title={`${
              stateUser.get.randomGroup ? 'Un' : 'R'
            }egister for Random Group Routine`}
            className="cloud upload icon"
            style={stylesForIcon('randomGroup')}
            onClick={() => onToggle('randomGroup')}
          />
        </div>
        <div className="extra content">
          <small>{user.name}</small>
        </div>
      </div>
    </Link>
  );
}
