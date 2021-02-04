import React, { ReactElement, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat, { Events } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';

interface Props {
  roomId: number;
}

export default function Chats({ roomId }: Props): ReactElement {
  const [chats, setChats] = useState<Chat[]>();
  const [input, setInput] = useState('');
  const {
    store: { user },
  } = useStore();

  const socket = io.connect(`/rooms/${roomId}/chat`);

  useEffect(() => {
    socket.emit(Events.findAll, (chats: Chat[]) => {
      console.log('chats', chats);
      return setChats(chats);
    });

    socket.on(Events.create, (chat: Chat) =>
      setChats((messages) => [...messages, chat]),
    );
    socket.on(Events.update, (chat: Chat) => {
      console.log('updateChat', chat);
    });
    return () => {
      socket.off(Events.create);
      socket.off(Events.update);
    };
  }, []);

  if (!chats) {
    return <LoadingSpinner />;
  }

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(Events.create, { msg: input, userId: user.id }, () =>
      setInput(''),
    );
  };

  return (
    <div>
      <div className="ui relaxed divided list">
        {chats.map((chat) => (
          <div key={chat.id} className="item">
            <div className="content">
              <a className="header">{chat.msg}</a>
              <div className="description">{chat.user.name}</div>
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
