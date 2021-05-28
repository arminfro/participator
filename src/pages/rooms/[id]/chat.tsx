import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Chats from '../../../components/chat/chats';
import RoomPage from '../../../components/room/page';
import Fetch from '../../../components/utils/container/fetch';
import { Chat } from '../../../types/chat';
import { Room } from '../../../types/room';
import { getAllIds } from '../../../utils/transform-tree';

export default function RoomChat() {
  const router = useRouter();

  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const onClickExpand = (chat: Chat) => {
    setExpandedKeys(expandedKeys.length === 0 ? getAllIds<Chat>(chat) : []);
  };

  return (
    // todo, make Fetch using Promise.all and pass url's by keys
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => (
        <Fetch<Chat> url={`api/rooms/${router.query.id}/chat`}>
          {(chat) => (
            <RoomPage
              room={room}
              path={[{ name: 'Chat', url: `/rooms/${room.id}/chat` }]}
              extra={[
                <Button key="expand" onClick={() => onClickExpand(chat)}>
                  {expandedKeys.length === 0 ? (
                    <ArrowsAltOutlined />
                  ) : (
                    <ShrinkOutlined />
                  )}
                </Button>,
              ]}
            >
              <Chats
                expandedKeys={expandedKeys}
                setExpandedKeys={setExpandedKeys}
                roomChat={chat}
                users={[room.admin, ...room.members]}
                roomId={room.id}
                chatId={room.chat.id}
              />
            </RoomPage>
          )}
        </Fetch>
      )}
    </Fetch>
  );
}
