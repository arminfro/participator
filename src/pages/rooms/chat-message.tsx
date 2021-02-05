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
        <div key={chat.id} className="item">
            <div className="content">
                <div className="description"><b>{chat.user.name} </b> {formatDistance(new Date(chat.updatedAt), new Date(), { includeSeconds: true })}</div>
                <div
                    className="text-with-markdown"
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(marked(chat.msg)),
                    }}
                />
            </div>
        </div>
    )
}
