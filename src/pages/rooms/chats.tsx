import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import Chat, { Events } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';
import ChatInputForm from './chat-input-form';
import ChatMessage from './chat-message';
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

  const onEdit = (chat: Chat, callback: Dispatch<SetStateAction<string>>): void => {

    socket.emit(Events.update, { id: chat.id, msg: chat.msg }, () =>
      callback(''),
    );
  };

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(Events.create, { msg: input, userId: user.id });
  };

  //   const divStyle: any = {
  //     overflow: 'auto',
  //     max- height: '40%'
  // }

  return (
    <div >
      <br></br>
      <div className="ui comments">
        <h3 className="ui dividing header">Chat</h3>
        {chats.map(chat => <ChatMessage key={chat.id} onEdit={onEdit} chat={chat} />)}
      </div>
      <ChatInputForm onSend={onSend} />
    </div>
  );
}
