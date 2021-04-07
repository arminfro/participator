import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import RoomUpdate from '../../../components/room/update';
import Fetch from '../../../components/utils/fetch';
import { Room } from '../../../types/room';

export default function RoomEdit(): ReactElement {
  const router = useRouter();

  return (
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => <RoomUpdate room={room} />}
    </Fetch>
  );
}
