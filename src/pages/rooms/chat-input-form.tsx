import React, { ReactElement, useState, Dispatch, SetStateAction } from 'react'
import Chat from '../../types/chat';

interface Props {
    onSend: (input: string, callback: Dispatch<SetStateAction<string>>) => void
    chat?: Chat
}

export default function ChatInputForm({ onSend, chat }: Props) {
    const [input, setInput] = useState((chat) ? chat.msg : '');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSend(input, setInput)
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
    }

    const onKeyDown = (e: any) => {
        if ((e.key == 'Enter') && e.ctrlKey) {
            onSend(e.target.value as string, setInput);
        }

    }

    return (
        <form className="ui reply form" onSubmit={onSubmit} >
            <div className="field">
                <textarea value={input}
                    onChange={onChange} onKeyDown={onKeyDown}
                    placeholder="Your Message"></textarea>
            </div>
            <button className="ui blue labled submit icon button ">
                <i className="icon edit"></i>send
            </button>
            <span className="actions">
                or <b>Ctrl-Return</b> to send
            </span>
        </form>
    )
}
