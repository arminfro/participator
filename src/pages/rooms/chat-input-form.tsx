import React, {
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import User from '../../types/user';
import Dropdown from './dropdown';

interface Props {
  onCreate: (input: string, callback: Dispatch<SetStateAction<string>>) => void;
  //onEdit: (input: string, callback: Dispatch<SetStateAction<string>>) => void;
  onCancel: (input: string) => void;
  preSetInput: string;
  setInput: Dispatch<SetStateAction<string>>;
  users?: User[];
  allowEscape: boolean
}

export default function ChatInputForm({ onCreate, onCancel, setInput, preSetInput, users, allowEscape }: Props) {
  const [userInput, setUserInput] = useState(preSetInput);
  const [oldMsg, setOldMsg] = useState(userInput);

  /* For @ Mention Dropdown */
  const [doAtMention, setDoAtmention] = useState(false);
  const [action, setAction] = useState('');
  const [typeAhead, setTypeAhead] = useState('');
  const [reducedUserList, setReducedUserList] = useState(users)

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (preSetInput !== '') {
      userInput.replace("\n", " \n");
    }
    onCreate(userInput, setInput);
    setInput('');
    setUserInput('')
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const onClickCancel = () => {
    setUserInput(oldMsg);
  };


  const isLetter = (char: string) => {
    return (/[a-zA-Z]/).test(char) && char.length == 1
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (doAtMention) {
      e.preventDefault();
      if (e.key == 'Backspace') {
        if (userInput.length > 0) {
          if (userInput[userInput.length - 1] === '@') {
            resetAtMention()
          }
          const input_ = userInput.substr(0, userInput.length - 1)
          setUserInput(input_)
          if (typeAhead.length > 0) {
            const tempTypeAhead = typeAhead.substr(0, typeAhead.length - 1)
            setTypeAhead(currentTypeAhead => currentTypeAhead.substr(0, currentTypeAhead.length - 1))
            setReducedUserList(users.filter(e => e.name.toLowerCase().startsWith(tempTypeAhead)));
          }
        }
      } else if (e.key == 'Escape') {
        resetAtMention()
        onCancel(oldMsg);
      } else if (isLetter(e.key)) {
        const tempTypeAhead = typeAhead + e.key
        setTypeAhead(currentTypeAhead => currentTypeAhead + e.key)
        setReducedUserList(users.filter(e => e.name.toLowerCase().startsWith(tempTypeAhead)));
        setUserInput(currentInput => currentInput + e.key)
      }
      setAction(e.key);
    }

    if (e.key == 'Enter' && e.ctrlKey) {
      userInput.replace("\n", " \n");
      onCreate(userInput, () => setUserInput(''));
    } else if (allowEscape && e.key == 'Escape') {
      onCancel(oldMsg);
    } else if (e.key == '@') {
      setOldMsg(userInput)
      setDoAtmention(true)
    }
  };

  const selectAtMention = (index: number, value: string): void => {

    setUserInput(oldMsg + '**@' + value + '** ');
    resetAtMention();
  };

  const resetAtMention = (): void => {
    setAction('');
    setDoAtmention(false);
    setReducedUserList(users);
    setTypeAhead('');
  }

  return (
    <form className="ui reply form" >
      <div className="dropdown-container">
        <textarea
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Your Message"
          id="msg"
        ></textarea>
        {doAtMention ? <Dropdown entries={reducedUserList.map((u) => u.name)} callback={selectAtMention} action={action} /> : ''}
      </div>
      <button onClick={onSubmit} className="ui blue labled submit icon button ">
        <i className="icon edit"></i>send
      </button>
      <span className="actions">
        or <b>Ctrl-Return</b>
      </span>

      {allowEscape && <button onClick={onClickCancel} className="ui red labled submit icon button ">
        <i className="icon cancel"></i>cancel
        </button>
      }
    </form>
  );
}
