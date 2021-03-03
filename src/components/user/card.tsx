import { subject } from '@casl/ability';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { Action } from '../../casl/action';
import { User, UserUpdateToggleKeys } from '../../types/user';
import { useAbility } from '../utils/casl-context';
import { useUserUpdate } from '../utils/hooks/use-user';

const onlineStyle = {
  color: 'green',
};

const offlineStyle = {
  color: 'black',
};

export interface Props {
  user: User;
}

export default function UserCard({ user }: Props): ReactElement {
  const stateUser = useUserUpdate(user.id, user, true, true);
  const ability = useAbility();

  const canReadUser = () => ability.can(Action.Read, subject('User', user));

  const onToggle = (attr: UserUpdateToggleKeys) => {
    canReadUser() && stateUser.set[attr](!stateUser.get[attr]);
  };

  const stylesForIcon = (attr: UserUpdateToggleKeys) => {
    return stateUser.get[attr] ? onlineStyle : offlineStyle;
  };

  return (
    <LinkWrapper canReadAbility={canReadUser()} id={user.id}>
      <div
        className={`ui card ${(canReadUser() && 'pointer') || ''}`}
        style={{ width: 120 }}
      >
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
        </div>
        <div className="extra content">
          <small>{user.name}</small>
        </div>
      </div>
    </LinkWrapper>
  );
}

function LinkWrapper(props: {
  children: ReactElement;
  canReadAbility: boolean;
  id: number;
}): ReactElement {
  if (props.canReadAbility) {
    return (
      <Link href={`/users/[id]`} as={`/users/${props.id}`}>
        {props.children}
      </Link>
    );
  } else {
    return props.children;
  }
}
