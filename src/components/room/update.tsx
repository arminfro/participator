import React, { ReactElement } from 'react';
import { Room } from '../../types/room';
import { useRoomUpdate } from '../utils/hooks/use-room';
import RoomForm from './form';

interface Props {
  room: Room;
  onCloseDrawer: () => void;
}

export default function RoomUpdate({
  room,
  onCloseDrawer,
}: Props): ReactElement {
  const roomUpdate = useRoomUpdate(room.id, room);
  return <RoomForm onCloseDrawer={onCloseDrawer} room={roomUpdate} />;
}
