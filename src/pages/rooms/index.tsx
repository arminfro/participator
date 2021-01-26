import { NextPageContext } from 'next';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import Room from '../../types/room';
import api from '../utils/api';
import getInitialProps from '../utils/get-initial-props';
import RoomTable from './room-table';

interface Props {
  rooms: Room[];
}

export default function Rooms({ rooms }: Props): ReactElement {
  return (
    <>
      {rooms.length && (
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

Rooms.getInitialProps = async ({ req, query }: NextPageContext) => {
  const rooms = await getInitialProps<Room[]>(req, query, {
    server: () => query.users,
    client: async () => await api('get', 'api/rooms'),
  });
  return { rooms };
};
