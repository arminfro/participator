import React, { Dispatch, SetStateAction } from 'react';
import { Chat } from '../../types/chat';
import ChatListItem from './chat-list-item';

interface Props {
  chats: Chat;
  onRemove: (chat: Chat) => void;
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void;
  onCreate: (
    msg: string,
    callback: Dispatch<SetStateAction<string>>,
    parentId?: number,
  ) => void;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  depth: number;
  collapseAll: boolean;
}

export default function ChatList({
  chats,
  onCreate,
  onEdit,
  onRemove,
  setInput,
  depth,
  collapseAll,
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
              setInput={setInput}
              depth={0}
              collapseAll={collapseAll}
            />
          ))}
        </div>
      )}
    </>
  );
}
