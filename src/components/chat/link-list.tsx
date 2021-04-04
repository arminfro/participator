import React, { CSSProperties } from 'react';
import { Chat } from '../../types/chat';
import ChatLinkListItem from './link-list-item';

interface Props {
  chat: Chat;
}

export default function ChatLinkList({ chat }: Props) {
  const listStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    width: window.visualViewport.width * 0.8, // todo
    height: '9em',
    padding: 2,
  };

  return (
    <>
      {chat.links && chat.links.length > 0 && (
        <div style={listStyle}>
          {chat.links.map((link) => (
            <ChatLinkListItem link={link} key={link.id} />
          ))}
        </div>
      )}
    </>
  );
}
