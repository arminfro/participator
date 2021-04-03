import {
  DeleteOutlined,
  DeliveredProcedureOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Avatar, Comment } from 'antd';
import { formatDistance } from 'date-fns';
import marked from 'marked';
import emoji from 'node-emoji';
import Prism from 'prismjs';
import React, { Dispatch, SetStateAction, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { prismLanguageMap } from '../../constants';
import { Chat } from '../../types/chat';
import { User } from '../../types/user';
import ChatForm from './form';
import ChatLinkList from './link-list';

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

  const chatFormProps = { users, onSubmit };
  const commentProps = {
    author: chat.user.name,
    avatar: (
      <Avatar
        src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png"
        alt={chat.user.name}
      />
    ),
  };

  return (
    <>
      <Comment
        actions={[
          <EditOutlined key="onEdit" onClick={() => setEdit(true)} />,
          <DeleteOutlined key="onDelete" onClick={() => onRemove(chat)} />,
          <DeliveredProcedureOutlined
            key="onReply"
            onClick={() => setReply(true)}
          />,
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
                      code: false,
                      span: false,
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
