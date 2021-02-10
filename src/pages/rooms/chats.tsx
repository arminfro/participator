import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import Chat, { Events } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';
import ChatInputForm from './chat-input-form';
import ChatMessage from './chat-message';
import { useSocket } from '../utils/useSocket';
import User from '../../types/user';

interface Props {
  roomId: number;
  users: User[];
}

export default function Chats({ roomId, users }: Props): ReactElement {
  const [input, setInput] = useState('');
  const {
    store: { user },
  } = useStore();

  const [chats, socket] = useSocket<Chat>(
    `/rooms/${roomId}/chat`,
    useMemo(() => {
      return {
        [Events.create]: () => {
          console.log('in callback: event create');
          setInput('');
        },
      };
    }, []),
  );

  if (!chats) {
    return <LoadingSpinner />;
  }

  const onEdit = (
    chat: Chat,
    callback: Dispatch<SetStateAction<string>>,
  ): void => {
    socket.emit(Events.update, { id: chat.id, msg: chat.msg }, () =>
      callback(''),
    );
  };

  const onSend = (msg: string) => {
    //e.preventDefault();
    socket.emit(Events.create, { msg, userId: user.id });
    console.log('event: on Send');
  };

  //   const divStyle: any = {
  //     overflow: 'auto',
  //     max- height: '40%'
  // }

  return (
    <div className="ui container" style={{ maxHeight: '900px' }}>
      <br></br>
      <h3 className="ui dividing header">Chat</h3>
      <div className="ui comments" style={{ maxHeight: '80%', overflow: 'scroll' }}>
        {chats.map((chat) => (
          <ChatMessage
            key={chat.id}
            onEdit={onEdit}
            chat={chat}
            input={input}
            setInput={setInput}
          />
        ))}
      </div>
      <ChatInputForm
        onSend={onSend}
        input={input}
        setInput={setInput}
        allowEscape={false}
        users={users}
      />
    </div >
  );
}
