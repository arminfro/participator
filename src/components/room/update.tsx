import React, { ReactElement } from 'react';
import { Room, RoomUpdate as IRoomUpdate } from '../../types/room';
import { MutateFunc } from '../utils/fetch';
import { useRoomUpdate } from '../utils/hooks/use-room';
import RoomForm from './form';

interface Props {
  room: Room;
  mutate: MutateFunc<IRoomUpdate>;
}

export default function RoomUpdate({ room, mutate }: Props): ReactElement {
  // todo, use mutate func
  const roomUpdate = useRoomUpdate(room.id, room, true, true);
  return (
    <>
      <h2>Room Edit</h2>
      <RoomForm room={roomUpdate} roomId={room.id} />
    </>
  );
}
