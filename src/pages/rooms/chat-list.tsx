import React, { Dispatch, SetStateAction } from 'react';
import Chat from '../../types/chat';
import ChatListItem from './chat-list-item';
import ChatMessage from './chat-message';

interface Props {
  chats: any;
  onRemove: (chat: Chat) => void;
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void;
  onCreate: (
    msg: string,
    callback: Dispatch<SetStateAction<string>>,
    parentId?: number,
  ) => void;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatList({
  chats,
  onCreate,
  onEdit,
  onRemove,
  setInput,
}: Props) {
  return (
    chats && (
      <div className="ui relaxed divided list">
        {chats.children.map((chat) => (
          <ChatListItem
            key={chat.id}
            onCreate={onCreate}
            onEdit={onEdit}
            onRemove={onRemove}
            chat={chat}
            setInput={setInput}
            depth={0}
          />
        ))}
      </div>
    )
  );
}
