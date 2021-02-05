import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat, { Events } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';
import ChatInputForm from './chat-input-form';
import ChatMessage from './chat-message';


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

  const onSend = (input: string, callback: Dispatch<SetStateAction<string>>): void => {

    socket.emit(Events.create, { msg: input, userId: user.id }, () =>
      callback(''),
    );
  };

  return (
    <div>
      <br></br>
      <div className="ui comments">
        <h3 className="ui dividing header">Chat</h3>
        {chats.map(chat => <ChatMessage key={chat.id} chat={chat} />)}
      </div>
      <ChatInputForm onSend={onSend} />
    </div>
  );
}
