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

  const defaultUrl = `${avatarUrl}/default.webp`;

  return (
    <>
      {error && fallbackChildren ? (
        fallbackChildren
      ) : (
        <Avatar
          src={error || !user.avatarUrl ? defaultUrl : user.avatarUrl}
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
