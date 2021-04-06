import { Descriptions } from 'antd';
import React from 'react';
import { Room } from '../../types/room';

interface Props {
  room: Room;
}

export default function RoomDashboard({ room }: Props) {
  return (
    <>
      <Descriptions>
        <Descriptions.Item label="Description">
          {room.description}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
