import React, {
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import Chat from '../../types/chat';
import User from '../../types/user';
import Dropdown from './dropdown';

interface Props {
  onSend: (input: string) => void;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  users: User[];
  chat?: Chat;
  allowEscape: boolean
}

export default function ChatInputForm({ onSend, chat, users, allowEscape }: Props) {
  const [input, setInput] = useState(chat ? chat.msg : '');
  const [oldMsg, setOldMsg] = useState(input);

  /* For @ Mention Dropdown */
  const [doAtMention, setDoAtmention] = useState(false);
  const [action, setAction] = useState('');
  const [typeAhead, setTypeAhead] = useState('');
  const [reducedUserList, setReducedUserList] = useState(users)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend(input);
    setInput('');
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onCancel = () => {
    setInput(oldMsg);
  };


  const isLetter = (char: string) => {
    return (/[a-zA-Z]/).test(char) && char.length == 1
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (doAtMention) {
      e.preventDefault();
      if (e.key == 'Backspace') {
        if (input.length > 0) {
          if (input[input.length - 1] === '@') {
            resetAtMention()
          }
          const input_ = input.substr(0, input.length - 1)
          setInput(input_)
          if (typeAhead.length > 0) {
            const tempTypeAhead = typeAhead.substr(0, typeAhead.length - 1)
            setTypeAhead(currentTypeAhead => currentTypeAhead.substr(0, currentTypeAhead.length - 1))
            setReducedUserList(users.filter(e => e.name.toLowerCase().startsWith(tempTypeAhead)));
            console.log("key TA", tempTypeAhead)
          }
        }
      } else if (e.key == 'Escape') {
        resetAtMention()
        onCancel();
      } else if (isLetter(e.key)) {
        const tempTypeAhead = typeAhead + e.key
        setTypeAhead(currentTypeAhead => currentTypeAhead + e.key)
        console.log("key TA", tempTypeAhead)
        setReducedUserList(users.filter(e => e.name.toLowerCase().startsWith(tempTypeAhead)));
        setInput(currentInput => currentInput + e.key)
        console.log("RUL: ", reducedUserList)
      }
      setAction(e.key);
    }

    if (e.key == 'Enter' && e.ctrlKey) {
      onSend(e.target.value as string);
    } else if (e.key == 'AltGraph') {
      console.log('alt graph');
    } else if (allowEscape && e.key == 'Escape') {
      onCancel();
    } else if (e.key == '@') {
      setOldMsg(input)
      setDoAtmention(true)
    } else {
      console.log(e.key)
    }
  };

  const selectAtMention = (index: number, value: string): void => {

    setInput(oldMsg + '**@' + value + '** ');
    resetAtMention();
  };

  const resetAtMention = (): void => {
    setAction('');
    setDoAtmention(false);
    setReducedUserList(users);
    setTypeAhead('');
    console.log(users)

  }

  return (
    <form className="ui reply form" onSubmit={onSubmit}>
      <div className="dropdown-container">
        <textarea
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Your Message"
          id="msg"
        ></textarea>
        {doAtMention ? <Dropdown entries={reducedUserList.map((u) => u.name)} callback={selectAtMention} action={action} /> : ''}
      </div>
      <button className="ui blue labled submit icon button ">
        <i className="icon edit"></i>send
      </button>
      <span className="actions">
        or <b>Ctrl-Return</b>
      </span>

      {allowEscape && <button onClick={onCancel} className="ui red labled submit icon button ">
        <i className="icon cancel"></i>cancel
        </button>
      }
    </form>
  );
}
