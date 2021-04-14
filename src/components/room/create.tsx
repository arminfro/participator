import React, { ReactElement } from 'react';
import { useRoomCreate } from '../utils/hooks/use-room';
import RoomForm from './form';

interface Props {
  onCloseDrawer: () => void;
}

export default function RoomCreate({ onCloseDrawer }: Props): ReactElement {
  const room = useRoomCreate();
  return <RoomForm room={room} onCloseDrawer={onCloseDrawer} />;
}
