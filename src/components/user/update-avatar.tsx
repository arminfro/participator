import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { avatarUrl } from '../../constants';
import { User } from '../../types/user';
import Upload from '../utils/container/upload';
import UserAvatar from '../utils/container/user-avatar';

interface Props {
  user: User;
}

export default function UserUpdateAvatar({ user }: Props) {
  return (
    <Upload
      uploadUrl={`/api/users/${user.id}/upload-avatar`}
      previewImgUrl={`${avatarUrl}/${user.uuid}`}
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
