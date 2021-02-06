import React, { ReactElement, useMemo, useState } from 'react';
import Chat, { Events } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';
import { useSocket } from '../utils/useSocket';

interface Props {
  roomId: number;
}

export default function Chats({ roomId }: Props): ReactElement {
  const [input, setInput] = useState('');
  const {
    store: { user },
  } = useStore();

  const [chats, socket] = useSocket<Chat>(
    `/rooms/${roomId}/chat`,
    useMemo(() => {
      return {
        [Events.create]: () => setInput(''),
      };
    }, []),
  );

  if (!chats) {
    return <LoadingSpinner />;
  }

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(Events.create, { msg: input, userId: user.id });
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
