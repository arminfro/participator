import { CarryOutOutlined } from '@ant-design/icons';
import { Tree, Comment, Avatar } from 'antd';
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { toast } from 'react-toastify';
import * as Faker from 'faker';
import { chatMsgDeleted, noop } from '../../constants';
import { Chat, Events, isChat } from '../../types/chat';
import {
  validateChatCreate,
  validateChatUpdate,
} from '../../types/chat.validation';
import { User } from '../../types/user';
import {
  addChild,
  newTree,
  removeChild,
  replaceChild,
} from '../../utils/transform-tree';
import LoadingSpinner from '../shared/loading-spinner';
import { useSocket } from '../utils/hooks/use-socket';
import { useStore } from '../utils/store/context';
import ChatForm from './form';
import ChatListItem from './list-item';

interface Props {
  roomId: number;
  chatId: number;
  users: User[];
}

export default function Chats({ roomId, chatId, users }: Props): ReactElement {
  const {
    store: { user },
  } = useStore();

  const [chat, socket] = useSocket<Chat>(
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
    useCallback((error: string, failures: string[]) => {
      console.error(error, failures);
      toast.error(error);
    }, []),
  );

  if (!chat) {
    return <LoadingSpinner />;
  }

  const onEdit = (
    chat: Chat,
    callback: Dispatch<SetStateAction<Chat>> = noop,
  ): void => {
    const chatUpdate = { id: chat.id, msg: chat.msg };
    const [, validatedChatUpdate] = validateChatUpdate(chatUpdate);
    if (validatedChatUpdate) {
      socket.emit(Events.update, chatUpdate, (chat: Chat) => {
        callback(chat);
      });
    }
  };

  const onRemove = (chat: Chat): void => {
    socket.emit(Events.remove, { id: chat.id });
  };

  const onCreate = (
    msg: string,
    callback: Dispatch<SetStateAction<Chat>> = noop,
    parentId: number = chatId,
  ) => {
    const chatCreate = { msg, userId: user.id, parentId };
    const [, validatedChatCreate] = validateChatCreate(chatCreate);
    if (validatedChatCreate) {
      socket.emit(Events.create, chatCreate, (chat: Chat) => {
        callback(chat);
      });
    }
  };

  const mapChatToTreeData = (chat: Chat) => {
    return {
      key: chat.id,
      children: chat.children ? chat.children.map(mapChatToTreeData) : [],
      title: (
        <ChatListItem
          onCreate={onCreate}
          onEdit={onEdit}
          onRemove={onRemove}
          users={users}
          chat={chat}
        />
      ),
    };
  };

  return (
    <>
      <Tree
        blockNode={true}
        selectable={false}
        switcherIcon={<CarryOutOutlined />}
        treeData={mapChatToTreeData(chat).children}
      />
      <Comment
        author={user.name}
        avatar={<Avatar src={Faker.image.avatar()} alt={chat.user.name} />}
        content={<ChatForm users={users} onSubmit={onCreate} value="" />}
      />
    </>
  );
}
