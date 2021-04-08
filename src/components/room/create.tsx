import React, { ReactElement } from 'react';
import { useRoomCreate } from '../utils/hooks/use-room';
import RoomForm from './form';

export default function RoomCreate(): ReactElement {
  const room = useRoomCreate();
  return (
    <>
      <h2>New Room</h2>
      <RoomForm room={room} />
    </>
  );
}
