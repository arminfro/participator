import { subject } from '@casl/ability';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import { Room } from '../../types/room';
import UserList from '../user/list';
import { Can } from '../utils/casl-context';
import Chats from '../chat/chats';
import RoomMemberManage from './member-manage';
import Fetch from '../utils/fetch';
import { User } from '../../types/user';

interface Props {
  room: Room;
}

export default function RoomDetails({ room }: Props): ReactElement {
  const joinedUsers = [room.admin, ...room.members];
  return (
    <>
      <h1>Room: {room.name}</h1>
      <h2 className="ui dividing header">Description:</h2>
      {room.description && <p>{room.description}</p>}
      <Can I="update" this={subject('Room', room)}>
        <h2>Room Manage</h2>
        <Fetch<User[]> url={`api/users`}>
          {(allUsers) => (
            <RoomMemberManage
              allUsers={allUsers.filter(
                (aUser) => !joinedUsers.some((jUser) => aUser.id === jUser.id),
              )}
              joinedUsers={room.members /* leave admin */}
              roomId={room.id}
            />
          )}
        </Fetch>
        <Link href="/rooms/[id]/edit" as={`/rooms/${room.id}/edit`}>
          <button className="ui button yellow">Edit</button>
        </Link>
      </Can>
      <div className="ui divider" />
      <Link href="/rooms/[id]/questions/" as={`/rooms/${room.id}/questions/`}>
        <button className="ui button blue">List of all questions</button>
      </Link>
      <Chats users={joinedUsers} roomId={room.id} chatId={room.chat.id} />
      <UserList users={joinedUsers} />
    </>
  );
}
