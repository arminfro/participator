import React, { ReactElement } from 'react';

import { Room } from '../../types/room';
import RoomList from '../../components/room/list';
import Page from '../../components/utils/container/page';
import Drawer from '../../components/utils/container/drawer';
import RoomCreate from '../../components/room/create';
import FetchDynamicImport from '../../components/utils/container/fetch-dynamic-import';

export default function RoomsIndex(): ReactElement {
  return (
    <FetchDynamicImport<Room[]> url={'api/rooms'}>
      {(rooms) => (
        <>
          <Page
            title="Rooms"
            extra={[
              <Drawer
                key="new-room"
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
    </FetchDynamicImport>
  );
}
