import React, { Dispatch, SetStateAction } from 'react';
import { Chat } from '../../types/chat';
import ChatListItem from './list-item';

interface Props {
  chats: Chat;
  onRemove: (chat: Chat) => void;
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void;
  onCreate: (
    msg: string,
    callback: Dispatch<SetStateAction<string>>,
    parentId?: number,
  ) => void;
  depth: number;
}

export default function ChatList({
  chats,
  onCreate,
  onEdit,
  onRemove,
  depth,
}: Props) {
  return (
    <>
      {chats.children && (
        <div
          className="ui relaxed divided list"
          style={{ marginLeft: depth * 30 }}
        >
          {chats.children.map((chat) => (
            <ChatListItem
              key={chat.id}
              onCreate={onCreate}
              onEdit={onEdit}
              onRemove={onRemove}
              chat={chat}
              depth={0}
            />
          ))}
        </div>
      )}
    </>
  );
}
