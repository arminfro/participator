import { Avatar, AvatarProps } from 'antd';
import React, { ReactElement, useState } from 'react';
import { avatarUrl } from '../../../constants';
import { User } from '../../../types/user';

interface Props extends AvatarProps {
  user: User;
  fallbackChildren?: ReactElement;
}

export default function UserAvatar({
  fallbackChildren,
  user,
  ...avatarProps
}: Props) {
  const [error, setError] = useState(false);

  // todo, get a better default
  const defaultUrl =
    'https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png';

  return (
    <>
      {error && fallbackChildren ? (
        fallbackChildren
      ) : (
        <Avatar
          src={error ? defaultUrl : `${avatarUrl}/${user.uuid}`}
          alt={user.name}
          onError={() => {
            setError(true);
            return true;
          }}
          {...avatarProps}
        />
      )}
    </>
  );
}
