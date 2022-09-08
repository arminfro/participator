import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Room } from '../../../types/room';
import RoomDetails from '../../../components/room/details';
import FetchDynamicImport from '../../../components/utils/container/fetch-dynamic-import';

export default function RoomIndex(): ReactElement {
  const router = useRouter();

  return (
    <FetchDynamicImport<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => <RoomDetails room={room} />}
    </FetchDynamicImport>
  );
}
