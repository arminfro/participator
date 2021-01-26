import { subject } from '@casl/ability';
import { NextPageContext } from 'next';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import Room from '../../../types/room';
import Users from '../../users';
import api from '../../utils/api';
import { Can } from '../../utils/casl-context';
import getInitialProps from '../../utils/get-initial-props';

interface Props {
  room: Room;
}

export default function RoomItem({ room }: Props): ReactElement {
  return (
    <>
      <h2>Room: {room.name}</h2>
      <Users users={[room.admin, ...room.members]} />
      <Can I="update" this={subject('Room', room)}>
        <Link href="/rooms/[id]/edit" as={`/rooms/${room.id}/edit`}>
          <button className="ui button yellow">Edit</button>
        </Link>
      </Can>
    </>
  );
}

RoomItem.getInitialProps = async ({ req, query }: NextPageContext) => {
  const room = await getInitialProps<Room>(req, query, {
    server: () => query.users,
    client: async () => await api('get', `api/rooms/${query.id}`),
  });
  return { room };
};
