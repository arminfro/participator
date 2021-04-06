import React, { ReactElement } from 'react';

import { Room } from '../../types/room';
import RoomList from '../../components/room/list';
import Fetch from '../../components/utils/fetch';
import Page from '../../components/utils/page';

export default function RoomsIndex(): ReactElement {
  return (
    <Page title="Rooms">
      <Fetch<Room[]> url={'api/rooms'}>
        {(rooms) => <RoomList rooms={rooms} />}
      </Fetch>
    </Page>
  );
}
