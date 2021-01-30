import React, { ReactElement, useEffect, useState } from 'react';
import Chat from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import { useApi } from '../utils/api';
import { useSocket } from '../utils/socket-context';
import { useStore } from '../utils/store/context';

interface Props {
  roomId: number;
}

export default function Chats({ roomId }: Props): ReactElement {
  const [messages, setMessages] = useApi<Chat[]>('get', `rooms/${roomId}/chat`);
  const [input, setInput] = useState('');
  const {
    store: { user },
  } = useStore();

  const socket = useSocket();

  const addChat = (chat: Chat) =>
    setMessages((messages) => [...messages, chat]);

  useEffect(() => {
    socket.on('newChat', addChat);
    return () => {
      socket.off('newChat');
    };
  }, []);

  if (!messages) {
    return <LoadingSpinner />;
  }

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(
      'createChat',
      { roomId: roomId, msg: input, userId: user.id },
      (resp: Chat) => {
        addChat(resp);
        setInput('');
      },
    );
  };

  return (
    <div>
      <div className="ui relaxed divided list">
        {messages.map((message) => (
          <div key={message.id} className="item">
            <div className="content">
              <a className="header">{message.msg}</a>
              <div className="description">{message.user.name}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={onSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your Message"
        />
      </form>
    </div>
  );
}
