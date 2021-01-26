import { NextPageContext } from 'next';
import React, { ReactElement } from 'react';
import Room, { JoinConditions } from '../../../types/room';
import api from '../../utils/api';
import getInitialProps from '../../utils/get-initial-props';
import RoomForm from '../form';

interface Props {
  room: Room;
}

export default function RoomEditForm({ room }: Props): ReactElement {
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

RoomEditForm.getInitialProps = async ({ req, query }: NextPageContext) => {
  const room = await getInitialProps<Room>(req, query, {
    server: () => query.room,
    client: async () => await api('get', `api/rooms/${query.id}`),
  });
  return { room };
};
