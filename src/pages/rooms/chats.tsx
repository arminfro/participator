import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
  useMemo,
} from 'react';

import Chat, { Events } from '../../types/chat';
import {
  addChild,
  removeChild,
  replaceChild,
} from '../../utils/transform-tree';
import LoadingSpinner from '../shared/loading-spinner';
import { useStore } from '../utils/store/context';
import ChatInputForm from './chat-input-form';
import ChatMessage from './chat-message';
import { useSocket } from '../utils/useSocket';
import User from '../../types/user';

interface Props {
  roomId: number;
  chatId: number;
  users: User[];
}

export default function Chats({ roomId, chatId, users }: Props): ReactElement {
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
          setData((chat) => ({ ...addChild<Chat>(chat, payload) }));
        },
        [Events.update]: (
          payload: Chat,
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          setData((chat) => ({ ...replaceChild<Chat>(chat, payload) }));
        },
        [Events.remove]: (
          payload: { id: number },
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          setData((chat) => ({ ...removeChild<Chat>(chat, payload.id) }));
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

  const onRemove = (chat: Chat): void => {
    socket.emit(Events.remove, { id: chat.id });
  };

  const onCreate = (
    msg: string,
    callback: Dispatch<SetStateAction<string>>,
    parentId: number = chatId,
  ) => {
    socket.emit(Events.create, { msg, userId: user.id, parentId }, () => {
      console.log('callback on create');
      callback('');
    });
  };

  const onCancel = () => {
    return;
  };

  const onReply = (chat: Chat) => {
    setInput(chat.msg);
  };

  return (
    <div className="ui segment">
      <h3 className="ui dividing header">Chat</h3>
      {chats && (
        <div className="ui relaxed divided list">
          {chats.children.map((chat) => (
            <ChatMessage
              key={chat.id}
              onCreate={onCreate}
              onEdit={onEdit}
              onRemove={onRemove}
              chat={chat}
              setInput={setInput}
              depth={0}
            />
          ))}
        </div>
      )}
      <ChatInputForm
        onCreate={onCreate}
        onCancel={onCancel}
        preSetInput={input}
        setInput={setInput}
        allowEscape={false}
        users={users}
      />
    </div>
  );
}
