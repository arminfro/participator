import React from 'react';
import { Chat } from '../../types/chat';
import ChatLinkListItem from './link-list-item';

interface Props {
  chat: Chat;
}

export default function ChatLinkList({ chat }: Props) {
  return (
    <>
      {chat.links && (
        <div className="ui link list">
          {chat.links.map((link) => (
            <ChatLinkListItem link={link} key={link.id} />
          ))}
        </div>
      )}
    </>
  );
}
