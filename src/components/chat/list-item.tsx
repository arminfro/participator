import {
  DeleteOutlined,
  DeliveredProcedureOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { subject } from '@casl/ability';
import { Comment, Popconfirm, Tooltip } from 'antd';
import { formatDistance } from 'date-fns';
import marked from 'marked';
import emoji from 'node-emoji';
import Prism from 'prismjs';
import React, { Dispatch, SetStateAction, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { Action } from '../../casl/action';
import { Chat } from '../../types/chat';
import { User } from '../../types/user';
import UserAvatar from '../utils/container/user-avatar';
import { Can } from '../utils/context/casl-context';
import ChatForm from './form';
import ChatLinkList from './link-list';

const prismLanguageMap = {
  css: Prism.languages.css,
  html: Prism.languages.html,
  javascript: Prism.languages.javascript,
  js: Prism.languages.js,
  jsx: Prism.languages.jsx,
  svg: Prism.languages.svg,
  ts: Prism.languages.ts,
  tsx: Prism.languages.tsx,
  typescript: Prism.languages.typescript,
  xml: Prism.languages.xml,
};

interface Props {
  chat: Chat;
  users: User[];
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<Chat>>) => void;
  onRemove: (chat: Chat) => void;
  onCreate: (
    input: string,
    callback: Dispatch<SetStateAction<Chat>>,
    chatId: number,
  ) => void;
}

export default function ChatListItem({
  chat,
  users,
  onCreate,
  onEdit,
  onRemove,
}: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);

  marked.setOptions({
    breaks: true,
    gfm: true,
    langPrefix: 'language-',
    highlight: (code, lang) => {
      if (prismLanguageMap[lang]) {
        return Prism.highlight(code, prismLanguageMap[lang], lang);
      } else {
        return code;
      }
    },
  });

  const onSubmit = (
    input: string,
    callback?: Dispatch<SetStateAction<Chat>>,
  ): void => {
    if (edit) {
      const updated: Chat = { ...chat, msg: input };
      onEdit(updated, (chat) => {
        callback(chat);
        setEdit(false);
      });
    } else if (reply) {
      onCreate(
        input,
        (chat) => {
          callback(chat);
          setReply(false);
        },
        chat.id,
      );
    }
  };

  const chatFormProps = { users, onSubmit, scrollOnInit: true };
  const commentProps = {
    author: chat.user.name,
    avatar: <UserAvatar user={chat.user} />,
  };

  return (
    <>
      <Comment
        style={{ cursor: 'default' }}
        actions={[
          <Can I={Action.Delete} this={subject('Chat', chat)} key="onDelete">
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this Chat?"
                onConfirm={() => onRemove(chat)}
              >
                <DeleteOutlined />
              </Popconfirm>
            </Tooltip>
          </Can>,
          <Can I={Action.Update} this={subject('Chat', chat)} key="onDelete">
            <Tooltip title="Edit">
              <EditOutlined
                onClick={() => setEdit((editState) => !editState)}
              />
            </Tooltip>
          </Can>,
          <Tooltip key="onReply" title="Reply">
            <DeliveredProcedureOutlined onClick={() => setReply(true)} />
          </Tooltip>,
        ]}
        datetime={
          <>
            {formatDistance(chat.updatedAt, new Date(), {
              includeSeconds: true,
            })}
            {' ago '}
            {chat.updatedAt.getTime() !== chat.createdAt.getTime() &&
              '(edited) '}
          </>
        }
        {...commentProps}
        content={
          <>
            <ChatLinkList chat={chat} />

            {!edit && (
              <div
                className="text-with-markdown"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(emoji.emojify(marked(chat.msg)), {
                    // allow any css class for `code` and `span`
                    allowedClasses: {
                      code: ['*'],
                      span: ['*'],
                    },
                  }),
                }}
              />
            )}

            {edit && (
              <ChatForm
                {...chatFormProps}
                onFinish={() => setEdit(false)}
                value={chat.msg}
              />
            )}
          </>
        }
      >
        {reply && (
          <Comment
            {...commentProps}
            content={
              <ChatForm
                {...chatFormProps}
                onFinish={() => setReply(false)}
                value={''}
              />
            }
          />
        )}
      </Comment>
    </>
  );
}
