import React, { Dispatch, SetStateAction, useState } from 'react';
import Prism from 'prismjs';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji';

import { Chat } from '../../types/chat';
import ChatInputForm from './input-form';
import ChatItemHeader from './item-header';
import ChatLinkList from './link-list';
import ChatList from './list';

interface Props {
  chat: Chat;
  depth: number;
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
}: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);

  marked.setOptions({
    breaks: true,
    gfm: true,
    langPrefix: 'language-',
    highlight: (code, lang) =>
      Prism.highlight(code, Prism.languages.javascript, lang),
  });

  const onClickEdit = (): void => {
    setEdit(true);
  };

  const onClickReply = (): void => {
    setReply(true);
  };

  const resetStatus = (): void => {
    setReply(false);
    setEdit(false);
  };

  const onCancel = () => {
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
    <div className="item pa-tb-20">
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
            preSetInput={edit && chat.msg}
            allowEscape={true}
          />
        ) : (
          <div className="content">
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
          </div>
        )}
      </div>
      <ChatList
        key={chat.id}
        onCreate={onCreate}
        onEdit={onEdit}
        onRemove={onRemove}
        chats={chat}
        depth={depth + 1}
      />
    </div>
  );
}
