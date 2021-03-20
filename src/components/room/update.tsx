import React, { ReactElement } from 'react';
import { Room } from '../../types/room';
import { useRoomUpdate } from '../utils/hooks/use-room';
import RoomForm from './form';

interface Props {
  room: Room;
}

export default function RoomUpdate({ room }: Props): ReactElement {
  const roomUpdate = useRoomUpdate(room.id, room);
  return (
    <>
      <h2>Room Edit</h2>
      <RoomForm room={roomUpdate} roomId={room.id} />
    </>
  );
}
