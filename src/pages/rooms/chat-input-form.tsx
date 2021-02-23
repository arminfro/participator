import React, { useState, Dispatch, SetStateAction, ReactElement } from 'react';
import User from '../../types/user';
import Dropdown from './dropdown';

interface Props {
  onCreate: (input: string, callback: Dispatch<SetStateAction<string>>) => void;
  onCancel: (input: string) => void;
  preSetInput: string;
  setInput: Dispatch<SetStateAction<string>>;
  users?: User[];
  allowEscape: boolean;
}

export default function ChatInputForm({
  onCreate,
  onCancel,
  setInput,
  preSetInput,
  users,
  allowEscape,
}: Props): ReactElement {
  const [userInput, setUserInput] = useState(preSetInput);
  const [oldMsg, setOldMsg] = useState(userInput);

  /* For @ Mention Dropdown */
  const [doAtMention, setDoAtmention] = useState(false);
  const [action, setAction] = useState('');
  const [typeAhead, setTypeAhead] = useState('');
  const [reducedUserList, setReducedUserList] = useState(users);
  const [caretPosition, setCaretPosition] = useState(0);

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  const onClickSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.preventDefault();
    if (preSetInput !== '') {
      userInput.replace('\n', ' \n');
    }
    onCreate(userInput, setInput);
    setInput('');
    setUserInput('');
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setUserInput(e.target.value);
  };

  const onClickCancel = (): void => {
    setUserInput(oldMsg);
    onCancel();
  };

  const isLetter = (char: string): boolean => {
    return /[a-zA-Z]/.test(char) && char.length == 1;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (doAtMention) {
      e.preventDefault();
      if (e.key == 'Backspace') {
        if (userInput.length > 0) {
          if (userInput[userInput.length - 1] === '@') {
            resetAtMention();
          }
          const input_ = userInput.substr(0, userInput.length - 1);
          setUserInput(input_);
          if (typeAhead.length > 0) {
            const tempTypeAhead = typeAhead.substr(0, typeAhead.length - 1);
            setTypeAhead((currentTypeAhead) =>
              currentTypeAhead.substr(0, currentTypeAhead.length - 1),
            );
            setReducedUserList(
              users.filter((e) =>
                e.name.toLowerCase().startsWith(tempTypeAhead),
              ),
            );
          }
        }
      } else if (e.key == 'Escape') {
        resetAtMention();
        onCancel(oldMsg);
      } else if (isLetter(e.key)) {
        const tempTypeAhead = typeAhead + e.key;
        setTypeAhead((currentTypeAhead) => currentTypeAhead + e.key);
        setReducedUserList(
          users.filter((e) => e.name.toLowerCase().startsWith(tempTypeAhead)),
        );
        setUserInput((currentInput) => currentInput + e.key);
      }
      setAction(e.key);
    }

    if (e.key == 'Enter' && e.ctrlKey) {
      userInput.replace('\n', ' \n');
      onCreate(userInput, () => setUserInput(''));
    } else if (allowEscape && e.key == 'Escape') {
      onCancel(oldMsg);
    } else if (e.key == '@') {
      if (!/\w/.test(userInput.charAt(e.target.selectionStart - 1))) {
        setOldMsg(userInput);
        setDoAtmention(true);
        setCaretPosition(e.target.selectionStart);
      }
    }
  };

  const selectAtMention = (index: number, value: string): void => {
    const addSpace = oldMsg.charAt(caretPosition - 1) !== ' ' ? ' ' : '';
    setUserInput(
      oldMsg.slice(0, caretPosition) +
        addSpace +
        '**@' +
        value +
        '** ' +
        oldMsg.slice(caretPosition),
    );
    resetAtMention();
  };

  const resetAtMention = (): void => {
    setAction('');
    setDoAtmention(false);
    setReducedUserList(users);
    setTypeAhead('');
  };

  return (
    <form className="ui reply form">
      <div className="dropdown-container">
        <textarea
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Your Message"
          id="msg"
        />
        {doAtMention && (
          <Dropdown
            entries={reducedUserList.map((u) => u.name)}
            callback={selectAtMention}
            action={action}
          />
        )}
      </div>
      <button
        onClick={onClickSubmit}
        className="ui blue labled submit icon button "
      >
        <i className="icon edit"></i>send
      </button>
      <span className="actions">
        or <b>Ctrl-Return</b>
      </span>

      {allowEscape && (
        <button
          type="button"
          onClick={onClickCancel}
          className="ui red labled submit icon button "
        >
          <i className="icon cancel"></i>cancel
        </button>
      )}
    </form>
  );
}
