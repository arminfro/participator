import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
  useMemo,
} from 'react';

import {
  addChild,
  removeChild,
  replaceChild,
} from '../../utils/transform-tree';
import { useStore } from '../utils/store/context';
import { useSocket } from '../utils/hooks/use-socket';
import { User } from '../../types/user';
import { Chat, Events } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import ChatList from './chat-list';
import ChatInputForm from './chat-input-form';

interface Props {
  roomId: number;
  chatId: number;
  users: User[];
}

export default function Chats({ roomId, chatId, users }: Props): ReactElement {
  const [input, setInput] = useState<string>('');
  const [doCollapseAll, setDoCollapseAll] = useState<boolean>(false);

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
      callback('');
    });
  };

  const onCancel = () => {
    return;
  };

  console.log('DoCollA: ', doCollapseAll);

  return (
    <div className="ui segment">
      <h3 className="ui dividing header">Chat</h3>
      {doCollapseAll ? (
        <button
          type="button"
          className="ui green labled submit icon button "
          onClick={() => setDoCollapseAll(false)}
        >
          <i className="icon cancel"></i>expand all
        </button>
      ) : (
        <button
          type="button"
          className="ui blue labled submit icon button "
          onClick={() => setDoCollapseAll(true)}
        >
          <i className="icon cancel"></i>collapse all
        </button>
      )}
      <ChatList
        chats={chats}
        onCreate={onCreate}
        onEdit={onEdit}
        onRemove={onRemove}
        setInput={setInput}
        depth={0}
        collapseAll={doCollapseAll}
      />

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
