import React, { ReactElement } from 'react';
import Page from '../utils/container/page';
import { useRoomCreate } from '../utils/hooks/use-room';
import RoomForm from './form';

export default function RoomCreate(): ReactElement {
  const room = useRoomCreate();
  return (
    <Page title="New Room">
      <RoomForm room={room} />
    </Page>
  );
}
