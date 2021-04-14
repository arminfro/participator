import { Button, Select } from 'antd';
import React, { useState } from 'react';
import { User } from '../../types/user';
import api from '../utils/funcs/api';

interface Props {
  allUsers: User[];
  joinedUsers: User[];
  roomId: number;
  onCloseDrawer: () => void;
}
export default function RoomMemberManage({
  allUsers,
  joinedUsers,
  roomId,
  onCloseDrawer,
}: Props) {
  const [isInviting, setIsInviting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [chosenUser, setChosenUser] = useState<User>();

  const label = () => (isInviting ? 'Invite' : 'Kick');

  const relevantUsers = () => (isInviting ? allUsers : joinedUsers);

  const onChangeActionSelect = (isInviting: string) => {
    setChosenUser(undefined);
    setIsInviting(isInviting === 'true');
  };
  const onChangeUserSelect = (userId: number) => {
    setChosenUser(relevantUsers().find((user) => user.id === userId));
  };

  const onSubmit = () => {
    if (
      window.confirm(`Are you sure you want to ${label()} ${chosenUser.name}`)
    ) {
      const action = isInviting ? 'addMember' : 'removeMember';
      setLoading(true);
      api(
        'patch',
        `api/rooms/${roomId}/${action}`,
        () => {
          setLoading(false);
          setChosenUser(undefined);
          onCloseDrawer();
        },
        {
          [action]: chosenUser,
        },
      );
    }
  };

  return (
    <>
      <Select
        onChange={onChangeActionSelect}
        value={String(isInviting)}
        className="select-before"
      >
        <Select.Option value="true">Invite</Select.Option>
        <Select.Option value="false">Kick</Select.Option>
      </Select>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a person"
        optionFilterProp="children"
        value={chosenUser?.id}
        onChange={onChangeUserSelect}
      >
        {(isInviting ? allUsers : joinedUsers).map((user) => (
          <Select.Option key={user.id} value={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
      <Button loading={loading} onClick={onSubmit} disabled={!chosenUser}>
        Submit
      </Button>
    </>
  );
}
