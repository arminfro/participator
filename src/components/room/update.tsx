import React, { ReactElement } from 'react';
import { JoinConditions, Room } from '../../types/room';
import RoomForm from './form';

interface Props {
  room: Room;
}

export default function RoomUpdate({ room }: Props): ReactElement {
  return (
    <>
      <h2>RoomEdit</h2>
      <RoomForm
        name={room.name}
        description={room.description}
        openToJoin={
          room.openToJoin ? JoinConditions.Open : JoinConditions.Closed
        }
        isEdit={true}
        roomId={room.id}
      />
    </>
  );
}
