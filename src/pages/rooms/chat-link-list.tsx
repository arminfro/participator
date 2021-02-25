import React from 'react';
import Chat from '../../../dist/src/types/chat';
import ChatLink from './chat-link';
import ChatLinkListItem from './chat-link-list-item';

interface Props {
  chat: Chat;
}

export default function ChatLinkList({ chat }: Props) {
  return (
    chat.links && (
      <div className="ui link list">
        {chat.links.map((link) => (
          <ChatLinkListItem link={link} key={link.id} />
        ))}
      </div>
    )
  );
}
