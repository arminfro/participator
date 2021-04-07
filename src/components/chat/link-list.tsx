import React, { CSSProperties } from 'react';
import { Chat } from '../../types/chat';
import useWindowSize from '../utils/hooks/use-window-size';
import ChatLinkListItem from './link-list-item';

interface Props {
  chat: Chat;
}

export default function ChatLinkList({ chat }: Props) {
  const { width } = useWindowSize();

  const listStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    height: '9em',
    padding: 2,
  };

  if (width) {
    listStyle.width = width - 430;
  }

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
