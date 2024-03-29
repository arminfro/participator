import { Divider } from 'antd';
import React, { ReactElement } from 'react';
import { Room } from '../../types/room';
import RoomTable from './table';

interface Props {
  rooms: Room[];
}

export default function RoomList({ rooms }: Props): ReactElement {
  return (
    <>
      {rooms.length > 0 && (
        <>
          <RoomTable rooms={rooms} />
          <Divider />
        </>
      )}
    </>
  );
}
