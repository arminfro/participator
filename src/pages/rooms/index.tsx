import React, { ReactElement } from 'react';

import { Room } from '../../types/room';
import RoomList from '../../components/room/list';
import Fetch from '../../components/utils/fetch';

export default function RoomsIndex(): ReactElement {
  return (
    <Fetch<Room[]> url={'api/rooms'}>
      {(rooms) => <RoomList rooms={rooms} />}
    </Fetch>
  );
}
