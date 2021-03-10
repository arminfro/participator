import React, { Dispatch, ReactElement, SetStateAction, useMemo } from 'react';

import {
  addChild,
  newTree,
  removeChild,
  replaceChild,
} from '../../utils/transform-tree';
import { useStore } from '../utils/store/context';
import { useSocket } from '../utils/hooks/use-socket';
import { User } from '../../types/user';
import { Chat, Events, isChat } from '../../types/chat';
import LoadingSpinner from '../shared/loading-spinner';
import ChatList from './list';
import ChatInputForm from './input-form';
import { chatMsgDeleted, noop } from '../../constants';

interface Props {
  roomId: number;
  chatId: number;
  users: User[];
}

export default function Chats({ roomId, chatId, users }: Props): ReactElement {
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
          payload: { id: number } | Chat,
          setData: Dispatch<SetStateAction<Chat>>,
        ) => {
          if (isChat(payload)) {
            setData((chat) => {
              const chatToReplace = newTree(chat).first(
                (node) => node.model.id === payload.id,
              ).model;
              return {
                ...replaceChild<Chat>(chat, {
                  ...chatToReplace,
                  msg: chatMsgDeleted,
                }),
              };
            });
          } else {
            setData((chat) => ({ ...removeChild<Chat>(chat, payload.id) }));
          }
        },
      };
    }, []),
  );

  if (!chats) {
    return <LoadingSpinner />;
  }

  const onEdit = (
    chat: Chat,
    callback: Dispatch<SetStateAction<string>> = noop,
  ): void => {
    socket.emit(Events.update, { id: chat.id, msg: chat.msg }, callback);
  };

  const onRemove = (chat: Chat): void => {
    socket.emit(Events.remove, { id: chat.id });
  };

  const onCreate = (
    msg: string,
    callback: Dispatch<SetStateAction<string>> = noop,
    parentId: number = chatId,
  ) => {
    socket.emit(Events.create, { msg, userId: user.id, parentId }, callback);
  };

  const onCancel = () => {
    return;
  };

  return (
    <div className="ui segment">
      <h3 className="ui dividing header">Chat</h3>
      <ChatList
        chats={chats}
        onCreate={onCreate}
        onEdit={onEdit}
        onRemove={onRemove}
        depth={0}
      />

      <ChatInputForm
        onCreate={onCreate}
        onCancel={onCancel}
        allowEscape={false}
        users={users}
      />
    </div>
  );
}
