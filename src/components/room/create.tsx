import React, { ReactElement } from 'react';
import { useRoomCreate } from '../utils/hooks/use-room';
import RoomForm from './form';

export default function RoomCreate(): ReactElement {
  const room = useRoomCreate(true, true);
  return (
    <div className="ui segment">
      <h4 className="ui top attached block header">New Room</h4>
      <div className="ui section divider" />
      <RoomForm room={room} />
    </div>
  );
}
