import React, { Dispatch, SetStateAction, useState } from 'react'
import Chat, { Events } from '../../types/chat';
import marked from 'marked'
import sanitizeHtml from 'sanitize-html';
import emoji from 'node-emoji'
import formatDistance from 'date-fns/formatDistance'
import ChatInputForm from './chat-input-form';
import { Room } from '../../server/rooms/room.entity';

interface Props {
    chat: Chat,
    //room: Room,
    input: string,
    setInput: Dispatch<SetStateAction<string>>,
    onEdit: (chat: Chat, callback: Dispatch<SetStateAction<string>>) => void
}

export default function ChatMessage({ chat, onEdit, setInput, input }: Props) {
    const [edit, setEdit] = useState<boolean>(false);

    const onClickEdit = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        setEdit(true);
    }

    const onSendCallback = () => {
        setEdit(false)
    }

    const onSend = (input: string): void => {
        const updated: Chat = { ...chat, msg: input }
        onEdit(updated, onSendCallback)
    }

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
                    <span className="date">{(new Date(chat.updatedAt).getTime() !== new Date(chat.createdAt).getTime()) ? '(edited)' : ''}</span>
                </div>

                {(edit) ? <ChatInputForm onSend={onSend} input={input} setInput={setInput} chat={chat} /> :
                    <div>
                        <div className="text-with-markdown"
                            dangerouslySetInnerHTML={{
                                __html: emoji.emojify(sanitizeHtml(marked(chat.msg))),
                            }}
                        />
                        <div className="actions">
                            <a className="edit" onClick={onClickEdit}>Edit</a>
                            <a className="reply">Reply</a>
                        </div>
                    </div>
                }

            </div>
        </div >
    )
}
