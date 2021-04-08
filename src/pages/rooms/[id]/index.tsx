import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Room } from '../../../types/room';
import RoomDetails from '../../../components/room/details';
import Fetch from '../../../components/utils/container/fetch';

export default function RoomIndex(): ReactElement {
  const router = useRouter();

  return (
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => <RoomDetails room={room} />}
    </Fetch>
  );
}
