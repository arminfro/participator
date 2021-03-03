import { subject } from '@casl/ability';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { Room } from '../../types/room';
import UserList from '../user/list';
import { Can } from '../utils/casl-context';
import Chats from '../chat/chats';

interface Props {
  room: Room;
}

export default function RoomDetails({ room }: Props): ReactElement {
  return (
    <>
      <h2>Room: {room.name}</h2>
      {room.description && <p>{room.description}</p>}
      <Can I="update" this={subject('Room', room)}>
        <Link href="/rooms/[id]/edit" as={`/rooms/${room.id}/edit`}>
          <button className="ui button yellow">Edit</button>
        </Link>
      </Can>
      <UserList users={[room.admin, ...room.members]} />
      <Chats
        users={[room.admin, ...room.members]}
        roomId={room.id}
        chatId={room.chat.id}
      />
    </>
  );
}
