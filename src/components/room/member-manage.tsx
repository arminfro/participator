import { Button, message, Popconfirm, Select } from 'antd';
import React, { useState } from 'react';
import { Room } from '../../types/room';
import { User } from '../../types/user';
import { useSwrMutateContext } from '../utils/context/swr-mutate-context';
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

  const mutate = useSwrMutateContext<Room>();

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
    const action = isInviting ? 'addMember' : 'removeMember';
    setLoading(true);
    api('patch', `api/rooms/${roomId}/${action}`, {
      [action]: chosenUser,
    })
      .then(() => {
        message.success(`${label()} of ${chosenUser.name} succeeded`);
        if (mutate[`api/rooms/${roomId}`]) {
          mutate[`api/rooms/${roomId}`]((room: Room) => ({
            ...room,
            members: isInviting
              ? [...room.members, chosenUser]
              : room.members.filter((user) => user.id !== chosenUser.id),
          }));
        }
      })
      .finally(() => {
        setLoading(false);
        setChosenUser(undefined);
        onCloseDrawer();
      });
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
      <Popconfirm
        title={
          chosenUser && `Are you sure you want to ${label()} ${chosenUser.name}`
        }
        disabled={!chosenUser}
        onConfirm={onSubmit}
      >
        <Button loading={loading}>Submit</Button>
      </Popconfirm>
    </>
  );
}
