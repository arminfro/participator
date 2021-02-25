import { formatDistance } from 'date-fns';
import React from 'react';
import Chat from '../../../dist/src/types/chat';

interface Props {
  chat: Chat;
  onClickEdit: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onClickReply: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onRemove: (chat: Chat) => void;
}

export default function ChatItemHeader({
  chat,
  onClickEdit,
  onClickReply,
  onRemove,
}: Props) {
  return (
    <div className="header">
      <img
        className="ui avatar image"
        src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png"
      />
      <a className="">{chat.user.name}</a>
      <span className="date">
        {' '}
        {formatDistance(chat.updatedAt, new Date(), {
          includeSeconds: true,
        })}
        {' ago '}
        {chat.updatedAt.getTime() !== chat.createdAt.getTime() && '(edited) '}
      </span>
      <i className="ui icon reply" onClick={onClickReply} />
      <i className="ui icon edit" onClick={onClickEdit} />
      <i className="ui icon remove" onClick={() => onRemove(chat)} />
    </div>
  );
}
