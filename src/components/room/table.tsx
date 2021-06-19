import { CheckOutlined, CloseOutlined, StarOutlined } from '@ant-design/icons';
import { subject } from '@casl/ability';
import { Button, Table } from 'antd';
import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import { Action } from '../../casl/action';

import { Room, RoomUpdate } from '../../types/room';
import api from '../utils/funcs/api';
import { useAbility } from '../utils/context/casl-context';
import { useCurrentUser } from '../utils/context/current-user';

interface Props {
  rooms: Room[];
}

export default function RoomTable({ rooms }: Props) {
  const { user } = useCurrentUser();
  const ability = useAbility();
  const router = useRouter();

  const canReadRoom = (room: Room): boolean => {
    return ability.can(Action.Read, subject('Room', room));
  };

  const onGoToRoom = (room: Room, justJoined = false) => {
    (canReadRoom(room) || justJoined) && router.push(`/rooms/${room.id}`);
  };

  const onJoin = (event: SyntheticEvent, roomId: number) => {
    event.preventDefault();
    const data: RoomUpdate = { addMember: user };
    api<Room>('patch', `api/rooms/${roomId}/addMember`, data).then(() =>
      onGoToRoom(
        rooms.find((r) => r.id === roomId),
        true,
      ),
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Open To Join',
      dataIndex: 'openToJoin',
      key: 'openToJoin',
      render: (_value: boolean, room: Room) =>
        room.openToJoin ? <CheckOutlined /> : <CloseOutlined />,
    },
    {
      title: 'Room Joined',
      key: 'joinColumn',
      render: (_value: boolean, room: Room) =>
        canReadRoom(room) ? (
          room.admin.id === user.id ? (
            <StarOutlined />
          ) : (
            <CheckOutlined />
          )
        ) : (
          room.openToJoin && (
            <Button onClick={(e) => onJoin(e, room.id)}>Join</Button>
          )
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rooms}
      rowKey="id"
      pagination={false}
      bordered={true}
      rowClassName={(room) => (canReadRoom(room) && 'pointer') || ''}
      onRow={(room) => ({
        onClick: () => onGoToRoom(room),
      })}
    />
  );
}
