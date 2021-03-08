import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Room } from '../../../types/room';
import RoomUpdate from '../../../components/room/update';
import Fetch from '../../../components/utils/fetch';

export default function RoomEdit(): ReactElement {
  const router = useRouter();
  return (
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => <RoomUpdate room={room} />}
    </Fetch>
  );
}
