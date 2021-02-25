import React, { useState, Dispatch, SetStateAction, ReactElement } from 'react';
import { User } from '../../types/user';
import Dropdown from './dropdown';

interface Props {
  onCreate: (
    input: string,
    callback?: Dispatch<SetStateAction<string>>,
  ) => void;
  onCancel: () => void;
  preSetInput?: string;
  users?: User[];
  allowEscape: boolean;
}

export default function ChatInputForm({
  onCreate,
  onCancel,
  preSetInput,
  users,
  allowEscape,
}: Props): ReactElement {
  const [input, setInput] = useState(preSetInput || '');
  const [oldMsg, setOldMsg] = useState(input);

  /* For @ Mention Dropdown */
  const [doAtMention, setDoAtmention] = useState(false);
  const [action, setAction] = useState('');
  const [typeAhead, setTypeAhead] = useState('');
  const [reducedUserList, setReducedUserList] = useState(users);
  const [caretPosition, setCaretPosition] = useState(0);

  const onClickSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.preventDefault();
    if (preSetInput !== '') {
      input.replace('\n', ' \n');
    }
    onCreate(input);
    setInput('');
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  const onClickCancel = (): void => {
    setInput(oldMsg);
    onCancel();
  };

  const isLetter = (char: string): boolean => {
    return /[a-zA-Z]/.test(char) && char.length == 1;
  };

  const isSpace = (char: string): boolean => {
    return /\s/.test(char) && char.length == 1;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (doAtMention) {
      e.preventDefault();
      if (e.key == 'Backspace') {
        if (input.length > 0) {
          if (input[input.length - 1] === '@') {
            resetAtMention();
          }
          const input_ = input.substr(0, input.length - 1);
          setInput(input_);
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
        onCancel();
      } else if (isLetter(e.key)) {
        if (reducedUserList.length == 0) {
          // no match found last time but user kept on typing
          resetAtMention();
        } else {
          const tempTypeAhead = typeAhead + e.key;
          setTypeAhead((currentTypeAhead) => currentTypeAhead + e.key);
          setReducedUserList(
            users.filter((e) => e.name.toLowerCase().startsWith(tempTypeAhead)),
          );
          setInput((currentInput) => currentInput + e.key);
        }
      } else if (isSpace(e.key)) {
        resetAtMention();
      }
      setAction(e.key);
    }

    if (e.key == 'Enter' && e.ctrlKey) {
      input.replace('\n', ' \n');
      onCreate(input, () => setInput(''));
    } else if (allowEscape && e.key == 'Escape') {
      onCancel();
    } else if (e.key == '@') {
      console.log('selectionstart', e.target);
      if (!/\w/.test(input.charAt(e.target.selectionStart - 1))) {
        setOldMsg(input);
        setDoAtmention(true);
        setCaretPosition(e.target.selectionStart);
      }
    }
  };

  const selectAtMention = (value: string): void => {
    const addSpace = oldMsg.charAt(caretPosition - 1) !== ' ' ? ' ' : '';
    setInput(
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
          value={input}
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
