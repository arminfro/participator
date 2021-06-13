import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { avatarUrl } from '../../constants';
import { User } from '../../types/user';
import Upload from '../utils/container/upload';
import UserAvatar from '../utils/container/user-avatar';
import { useSwrMutateContext } from '../utils/context/swr-mutate-context';

interface Props {
  user: User;
}

export default function UserUpdateAvatar({ user }: Props) {
  const swrMutate = useSwrMutateContext<User>();
  return (
    <Upload
      uploadUrl={`/api/users/${user.id}/upload-avatar`}
      previewImgUrl={`${avatarUrl}/${user.uuid}`}
      onDone={(fileUrl) => {
        swrMutate[`api/users/${user.id}`]((user) => {
          return { ...user, avatarUrl: fileUrl };
        });
      }}
    >
      <UserAvatar
        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        shape="square"
        user={user}
        fallbackChildren={<PlusOutlined />}
      />
    </Upload>
  );
}
