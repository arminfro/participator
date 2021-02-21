import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { Chat, Events } from '../../types/chat';
import {
  addChild,
  removeChild,
  replaceChild,
} from '../../utils/transform-tree';
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
        [Events.findAll]: (
          payload: Chat,
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          setData(payload);
        },
        [Events.create]: (
          payload: Chat,
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          setData((chat) => addChild<Chat>(chat, payload));
        },
        [Events.update]: (
          payload: Chat,
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          setData((chat) => replaceChild<Chat>(chat, payload));
        },
        [Events.remove]: (
          payload: { id: number },
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          setData((chat) => removeChild<Chat>(chat, payload.id));
        },
      };
    }, []),
  );

  if (!chats) {
    return <LoadingSpinner />;
  }

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(
      Events.create,
      {
        msg: input,
        userId: user.id,
        parentId: 23, // test, wait for `chat` branch
      },
      () => setInput(''),
    );
  };

  const editChat = (id: number) => {
    socket.emit(Events.update, { id, msg: '01011' }); // test, wait for `chat` branch
  };

  const onDelete = (chatId: number) => {
    socket.emit(Events.remove, { id: chatId }, (chat) =>
      console.log('Chat Deleted', chat),
    );
  };

  return (
    <div>
      <div className="ui relaxed divided list">
        {chats &&
          chats.children.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              editChat={editChat}
              onDelete={onDelete}
            />
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

function ChatItem({ chat, onDelete, editChat, depth = 0 }: any): ReactElement {
  return (
    <>
      <div key={chat.id} className="item">
        <div className="content">
          <div className="meta">
            Lvl: {depth}, id: {chat.id}
          </div>
          <a className="header">{chat.msg}</a>
          <i className="icon delete" onClick={() => onDelete(chat.id)} />
          <i className="icon pencil" onClick={() => editChat(chat.id)} />
        </div>
      </div>
      {chat.children &&
        chat.children.length > 0 &&
        chat.children.map((chat: Chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            editChat={editChat}
            depth={depth + 1}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}
