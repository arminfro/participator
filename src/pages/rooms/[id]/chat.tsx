import { useRouter } from 'next/router';
import React from 'react';
import Chats from '../../../components/chat/chats';
import RoomPage from '../../../components/room/page';
import Fetch from '../../../components/utils/container/fetch';
import { Room } from '../../../types/room';

export default function RoomChat() {
  const router = useRouter();

  return (
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => (
        <RoomPage
          room={room}
          path={[{ name: 'Chat', url: `/rooms/${room.id}/chat` }]}
        >
          <Chats
            users={[room.admin, ...room.members]}
            roomId={room.id}
            chatId={room.chat.id}
          />
        </RoomPage>
      )}
    </Fetch>
  );
}
