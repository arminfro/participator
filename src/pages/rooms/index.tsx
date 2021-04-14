import React, { ReactElement } from 'react';

import { Room } from '../../types/room';
import RoomList from '../../components/room/list';
import Fetch from '../../components/utils/container/fetch';
import Page from '../../components/utils/container/page';
import Drawer from '../../components/utils/container/drawer';
import RoomCreate from '../../components/room/create';

export default function RoomsIndex(): ReactElement {
  return (
    <Fetch<Room[]> url={'api/rooms'}>
      {(rooms) => (
        <>
          <Page
            title="Rooms"
            extra={[
              <Drawer
                key="new-room"
                contentWrapperStyle={{ width: 512 }}
                primaryButton
                action="Create"
                subject="Room"
              >
                {(onClose: () => void) => (
                  <RoomCreate onCloseDrawer={onClose} />
                )}
              </Drawer>,
            ]}
          >
            <RoomList rooms={rooms} />
          </Page>
        </>
      )}
    </Fetch>
  );
}
