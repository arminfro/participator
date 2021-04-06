import { useRouter } from 'next/router';
import React from 'react';
import RoomPage from '../../../components/room/page';
import UserList from '../../../components/user/list';
import Fetch from '../../../components/utils/fetch';
import { Room } from '../../../types/room';

export default function RoomUsers() {
  const router = useRouter();
  return (
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => (
        <RoomPage
          room={room}
          path={[{ name: 'Users', url: `/rooms/${room.id}/users` }]}
        >
          <UserList users={[room.admin, ...room.members]} />
        </RoomPage>
      )}
    </Fetch>
  );
}
