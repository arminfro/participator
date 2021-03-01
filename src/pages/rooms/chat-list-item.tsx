import React, { Dispatch, SetStateAction, useState } from 'react';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji';

import { Chat } from '../../types/chat';
import ChatInputForm from './chat-input-form';
import ChatItemHeader from './chat-item-header';
import ChatLinkList from './chat-link-list';
import ChatList from './chat-list';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { useStore } from '../utils/store/context';

interface Props {
  chat: Chat;
  depth: number;
  collapseAll: boolean;
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
  collapseAll,
  onCreate,
  onEdit,
  onRemove,
  setInput,
}: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const {
    store: { user },
  } = useStore();

  marked.setOptions({
    breaks: true,
    gfm: true,
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

  const createResponse = () => {
    const msgContent: JSX.Element = (
      <div className="content">
        {chat.msg.includes('**@' + user.name + '**') && (
          <p>you've been mentionded</p>
        )}
        <div
          className="text-with-markdown"
          dangerouslySetInnerHTML={{
            __html: emoji.emojify(
              sanitizeHtml(
                marked(
                  chat.msg.replace(
                    '**@' + user.name + '**',
                    `<mention>**@${user.name}**</mention>`,
                  ),
                ),
                {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    'mention',
                  ]),
                },
              ),
            ),
          }}
        />
      </div>
    );

    const inputForm: JSX.Element = (
      <ChatInputForm
        onCreate={onSend}
        onCancel={onCancel}
        preSetInput={reply ? '' : chat.msg}
        setInput={setInput}
        allowEscape={true}
      />
    );

    if (edit) {
      return inputForm;
    } else if (reply) {
      return [msgContent, inputForm];
    } else {
      return msgContent;
    }
  };

  return (
    <div className="item pa-tb-20">
      <ChatItemHeader
        chat={chat}
        onClickEdit={onClickEdit}
        onClickReply={onClickReply}
        onRemove={onRemove}
        collapsed={collapsed}
        setCollapsed={setCollapsed || collapseAll}
      />
      <div className="description">
        <ChatLinkList chat={chat} />
        {createResponse()}
      </div>
      {(!collapsed || collapseAll) && (
        <ChatList
          key={chat.id}
          onCreate={onCreate}
          onEdit={onEdit}
          onRemove={onRemove}
          chats={chat}
          setInput={setInput}
          depth={depth + 1}
        />
      )}
    </div>
  );
}
