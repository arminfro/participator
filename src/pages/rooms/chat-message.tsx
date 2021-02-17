import React, { Dispatch, SetStateAction, useState } from 'react';
import Chat from '../../types/chat';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji';
import formatDistance from 'date-fns/formatDistance';
import ChatInputForm from './chat-input-form';
import ChatLink from './chat-link';

interface Props {
  chat: Chat;
  //room: Room,
  setInput: Dispatch<SetStateAction<string>>;
  onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void;
  onCreate: (input: string, callback: Dispatch<SetStateAction<string>>) => void;
}

export default function ChatMessage({ chat, onCreate, onEdit, setInput }: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);

  const onClickEdit = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    setEdit(true);
  };

  const onClickReply = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    setReply(true)
  };

  const resetStatus = (): void => {
    setReply(false);
    setEdit(false);
  };

  const onCancel = (msg: string) => {
    resetStatus();
  }

  const createReplyString = (chat: Chat, newInput: string): string => {
    return `Reply to ${chat.user.name}'s Message on ${new Date(chat.updatedAt).toLocaleDateString()}: \n ${chat.msg.replace(/^/gm, "> ")} \n\n  ${newInput}`
  }

  const onSend = (input: string): void => {
    if (edit) {
      const updated: Chat = { ...chat, msg: input };
      onEdit(updated, resetStatus);
    } else if (reply) {
      onCreate(createReplyString(chat, input), resetStatus);
    }
    resetStatus();
  };


  return (
    <div className="comment">
      <a className="avatar">
        <img src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png" />
      </a>
      <div className="content">
        <a className="author">{chat.user.name}</a>
        <div className="metadata">
          <span className="date">
            {formatDistance(new Date(chat.updatedAt), new Date(), {
              includeSeconds: true,
            })}
          </span>
          <span className="date">
            {new Date(chat.updatedAt).getTime() !==
              new Date(chat.createdAt).getTime()
              && '(edited)'
            }
          </span>
        </div>
        {(chat.links) && (
          chat.links.map((l, i) => <ChatLink link={l} key={i} />
          )
        )
        }
        {edit || reply ? (
          <ChatInputForm
            onCreate={onSend}
            onCancel={onCancel}
            preSetInput={(reply) ? '' : chat.msg}
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
                <a className="reply" onClick={onClickReply}>Reply</a>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
