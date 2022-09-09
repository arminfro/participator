import { subject } from '@casl/ability';
import React, { ReactElement } from 'react';
import { Room } from '../../types/room';
import { Can } from '../utils/context/casl-context';
import Drawer from '../utils/container/drawer';
import RoomDashboard from './dashboard';
import RoomPage from './page';
import RoomUpdate from './update';

interface Props {
  room: Room;
}

export default function RoomDetails({ room }: Props): ReactElement {
  return (
    <RoomPage
      extra={[
        <Can I="update" this={subject('Room', room)} key="can-i-update">
          <Drawer action="Edit" subject="Room">
            {(onClose: () => void) => (
              <RoomUpdate onCloseDrawer={onClose} room={room} />
            )}
          </Drawer>
        </Can>,
      ]}
      room={room}
    >
      <RoomDashboard room={room} />
    </RoomPage>
  );
}
