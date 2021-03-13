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
      {rooms.length > 0 && (
        <>
          <h2>Room Index</h2>
          <RoomTable rooms={rooms} />
        </>
      )}
      <Link href="/rooms/new">
        <button className="ui button green">New Room</button>
      </Link>
    </>
  );
}
