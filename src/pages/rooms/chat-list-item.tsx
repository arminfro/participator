import React, { Dispatch, SetStateAction, useState } from 'react';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji';

import Chat from '../../types/chat';
import ChatInputForm from './chat-input-form';
import ChatLink from './chat-link';
import ChatItemHeader from './chat-item-header';
import ChatLinkList from './chat-link-list';

interface Props {
  chat: Chat;
  depth: number;
  setInput: Dispatch<SetStateAction<string>>;
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void;
  onRemove: (chat: Chat) => void;
  onCreate: (
    input: string,
    callback: Dispatch<SetStateAction<string>>,
    chatId: number,
  ) => void;
}

export default function ChatListItem({
  chat,
  depth,
  onCreate,
  onEdit,
  onRemove,
  setInput,
}: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

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
    <div className="item pa-tb-20" style={{ marginLeft: depth * 30 }}>
      <ChatItemHeader
        chat={chat}
        onClickEdit={onClickEdit}
        onClickReply={onClickReply}
        onRemove={onRemove}
      />
      <div className="description">
        <ChatLinkList chat={chat} />
        {edit || reply ? (
          <ChatInputForm
            onCreate={onSend}
            onCancel={onCancel}
            preSetInput={reply ? '' : chat.msg}
            setInput={setInput}
            allowEscape={true}
          />
        ) : (
          <div className="content">
            <div
              className="text-with-markdown"
              dangerouslySetInnerHTML={{
                __html: emoji.emojify(sanitizeHtml(marked(chat.msg))),
              }}
            />
          </div>
        )}
      </div>
      {chat.children &&
        chat.children.map((chat: Chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onCreate={onCreate}
            onEdit={onEdit}
            onRemove={onRemove}
            setInput={setInput}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
