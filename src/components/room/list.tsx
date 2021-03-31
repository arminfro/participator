import { Breadcrumb, Button, Divider } from 'antd';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import { Room } from '../../types/room';
import RoomTable from './table';

interface Props {
  rooms: Room[];
}

export default function RoomList({ rooms }: Props): ReactElement {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Rooms</Breadcrumb.Item>
      </Breadcrumb>

      {rooms.length > 0 && (
        <>
          <Divider />
          <RoomTable rooms={rooms} />
        </>
      )}
      <Divider />
      <Button type="primary">
        <Link href="/rooms/new">New Room</Link>
      </Button>
    </>
  );
}
