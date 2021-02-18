import React, { Dispatch, SetStateAction, useState } from 'react';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji';

import Chat from '../../types/chat';
import formatDistance from 'date-fns/formatDistance';
import ChatInputForm from './chat-input-form';
import ChatLink from './chat-link';

interface Props {
  chat: Chat;
  depth: number;
  setInput: Dispatch<SetStateAction<string>>;
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void;
  onCreate: (
    input: string,
    callback: Dispatch<SetStateAction<string>>,
    chatId: number,
  ) => void;
}

export default function ChatMessage({
  chat,
  depth,
  onCreate,
  onEdit,
  setInput,
}: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);

  const onClickEdit = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    setEdit(true);
  };

  const onClickReply = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    setReply(true);
  };

  const resetStatus = (): void => {
    setReply(false);
    setEdit(false);
  };

  const onCancel = (msg: string) => {
    resetStatus();
  };

  const onSend = (input: string): void => {
    if (edit) {
      const updated: Chat = { ...chat, msg: input };
      onEdit(updated, resetStatus);
    } else if (reply) {
      onCreate(input, resetStatus, chat.id);
    }
    resetStatus();
  };

  return (
    <>
      <div className="comment" style={{ marginLeft: depth * 50 }}>
        <a className="avatar">
          <img src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png" />
        </a>
        <div className="content">
          <a className="author">{chat.user.name}</a>
          <div className="metadata">
            <span className="date">
              {formatDistance(chat.updatedAt, new Date(), {
                includeSeconds: true,
              })}
            </span>
            <span className="date">
              {chat.updatedAt.getTime() !== chat.createdAt.getTime() &&
                '(edited)'}
            </span>
          </div>
          {chat.links &&
            chat.links.map((link) => <ChatLink link={link} key={link.id} />)}
          {edit || reply ? (
            <ChatInputForm
              onCreate={onSend}
              onCancel={onCancel}
              preSetInput={reply ? '' : chat.msg}
              setInput={setInput}
              allowEscape={true}
            />
          ) : (
            <div>
              <div
                className="text-with-markdown"
                dangerouslySetInnerHTML={{
                  __html: emoji.emojify(sanitizeHtml(marked(chat.msg))),
                }}
              />
              <div className="actions">
                <a className="edit" onClick={onClickEdit}>
                  Edit
                </a>
                <a className="reply" onClick={onClickReply}>
                  Reply
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {chat.children &&
        chat.children.map((chat: Chat) => (
          <ChatMessage
            key={chat.id}
            chat={chat}
            onCreate={onCreate}
            onEdit={onEdit}
            setInput={setInput}
            depth={depth + 1}
          />
        ))}
    </>
  );
}
