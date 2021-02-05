import React, { ReactElement, useState, Dispatch, SetStateAction } from 'react'

interface Props {
    onSend: (input: string, callback: Dispatch<SetStateAction<string>>) => void// todo richtiger Typ angeben
}

export default function ChatInputForm({ onSend }: Props) {
    const [input, setInput] = useState('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSend(input, setInput)
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" className="ui huge input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your Message"
            />
            <button className="ui button blue">send</button>
        </form>
    )
}
