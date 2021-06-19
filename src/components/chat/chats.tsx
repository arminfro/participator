import { VerticalLeftOutlined } from '@ant-design/icons';
import { Comment, message, Tooltip, Tree } from 'antd';
import { uniq } from 'lodash';
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
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
import UserAvatar from '../utils/container/user-avatar';
import { useCurrentUser } from '../utils/context/current-user';
import { useSocket } from '../utils/hooks/use-socket';
import useTree from '../utils/hooks/use-tree';
import useWindowSize from '../utils/hooks/use-window-size';
import ChatForm from './form';
import ChatListItem from './list-item';

interface Props {
  roomId: number;
  chatId: number;
  users: User[];
  roomChat: Chat;
  expandedKeys: number[];
  setExpandedKeys: Dispatch<SetStateAction<number[]>>;
}

export default function Chats({
  roomId,
  chatId,
  roomChat,
  users,
  expandedKeys,
  setExpandedKeys,
}: Props): ReactElement {
  const { user } = useCurrentUser();

  const [chat, socket] = useSocket<Chat>(
    `/rooms/${roomId}/chat`,
    useMemo(() => {
      return {
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
    roomChat,
    useCallback((error: string) => {
      message.error(error);
    }, []),
  );

  const { height } = useWindowSize();

  const { setTree, scrollToKey } = useTree();

  // todo, may use state for lastChatId
  const lastChatId =
    chat?.children && chat.children[chat.children.length - 1]?.id;
  useEffect(() => {
    // todo, doesn't get triggered after replying chat
    if (lastChatId) {
      scrollToKey(lastChatId);
    }
  }, [scrollToKey, lastChatId]);

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
        callback(chat); // ?
        if (chat.parent) {
          expand(chat.parent.id);
        }
        scrollToKey(chat.id);
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

  const expand = (id: number) => {
    if (id === chatId) {
      return;
    }
    setExpandedKeys((currentExpandedKeys) => {
      return [...currentExpandedKeys, id];
    });
  };

  const onExpand = (_expandedKeys: number[], { node }: { node: any }) => {
    setExpandedKeys((currentExpandedKeys) =>
      node.expanded
        ? currentExpandedKeys.filter((key) => key !== node.key)
        : uniq([...currentExpandedKeys, node.key]),
    );
  };

  return (
    <>
      {chat && chat.children && (
        <Tree
          ref={setTree}
          height={height - 400}
          blockNode={true}
          selectable={false}
          treeData={mapChatToTreeData(chat).children}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          switcherIcon={
            <Tooltip title="Expand / Unexpand">
              <VerticalLeftOutlined style={{ fontSize: '1em' }} />
            </Tooltip>
          }
        />
      )}
      <Comment
        author={user.name}
        avatar={<UserAvatar user={user} />}
        content={<ChatForm users={users} onSubmit={onCreate} value="" />}
      />
    </>
  );
}
