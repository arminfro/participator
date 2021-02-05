import React from 'react'
import Chat, { Events } from '../../types/chat';
import marked from 'marked'
import sanitizeHtml from 'sanitize-html';
import formatDistance from 'date-fns/formatDistance'

interface Props {
    chat: Chat;
}

export default function ChatMessage({ chat }: Props) {

    return (
        <div className="comment">
            <a className="avatar">
                <img src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png" />
            </a>
            <div className="content">
                <a className="author">
                    {chat.user.name}
                </a>
                <div className="metadata">
                    <span className="date">{formatDistance(new Date(chat.updatedAt), new Date(), { includeSeconds: true })}</span>
                </div>

                <div
                    className="text-with-markdown"
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(marked(chat.msg)),
                    }}
                />
            </div>
        </div >
    )
}
