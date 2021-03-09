import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji';

import { Chat } from '../../types/chat';
import ChatInputForm from './chat-input-form';
import ChatItemHeader from './chat-item-header';
import ChatLinkList from './chat-link-list';
import ChatList from './chat-list';
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

  useEffect(() => {
    setCollapsed(collapseAll);

    console.log('cA', collapseAll);
  }, [collapseAll]);

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

  return (
    <div className="item pa-tb-20">
      <ChatItemHeader
        chat={chat}
        onClickEdit={onClickEdit}
        onClickReply={onClickReply}
        onRemove={onRemove}
        collapsed={collapsed || collapseAll}
        setCollapsed={setCollapsed}
      />
      <div className="description">
        <ChatLinkList chat={chat} />
        {!edit && (
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
        )}
        {(edit || reply) && (
          <ChatInputForm
            onCreate={onSend}
            onCancel={onCancel}
            preSetInput={reply ? '' : chat.msg}
            setInput={setInput}
            allowEscape={true}
          />
        )}
      </div>
      {!collapsed && (
        <ChatList
          key={chat.id}
          onCreate={onCreate}
          onEdit={onEdit}
          onRemove={onRemove}
          chats={chat}
          setInput={setInput}
          depth={depth + 1}
          collapseAll={collapsed}
        />
      )}
    </div>
  );
}
