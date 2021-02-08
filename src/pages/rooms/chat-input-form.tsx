import React, { ReactElement, useState, Dispatch, SetStateAction, useEffect } from 'react'
import Chat from '../../types/chat';

interface Props {
    onSend: (input: string) => void
    input: string,
    setInput: Dispatch<SetStateAction<string>>,
    chat?: Chat
}

export default function ChatInputForm({ onSend, chat }: Props) {
    const [input, setInput] = useState((chat) ? chat.msg : '');
    const [oldMsg, setOldMsg] = useState(input);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSend(input)
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        console.log(e.target.value)
    }

    const onCancel = () => {
        setInput(oldMsg);
    }

    const onKeyDown = (e: any) => {
        if ((e.key == 'Enter') && e.ctrlKey) {
            onSend(e.target.value as string);
        } else if (e.key == 'AltGraph') {
            console.log("alt graph")
        } else if (e.key == 'Escape') {
            onCancel();
        } else if (e.key == '@') {
            //console.log(chat.room.members)
        } else {
            console.log(e.key)
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
                or <b>Ctrl-Return</b>
            </span>

            {(oldMsg !== '') ?
                <button onClick={onCancel} className="ui red labled submit icon button ">
                    <i className="icon cancel"></i>cancel
            </button> :
                ''
            }
        </form>
    )
}
