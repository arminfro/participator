import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

export interface Position {
  x: number;
  y: number;
}

interface Props {
  entries: string[];
  callback: (index: number, value: string) => void;
  action: string;
}

export default function Dropdown({
  entries,
  callback,
  action,
}: Props): ReactElement {
  const [selected, setSelected] = useState(0);
  const dropdownRef = useRef(null);

  const select = useCallback(
    (i: number, element: string) => {
      callback(i, element);
    },
    [callback],
  );

  const onAction = useCallback(
    (action: string): void => {
      if (action == 'Enter') {
        select(selected, entries[selected]);
      } else if (action == 'ArrowDown') {
        setSelected((selected + 1) % entries.length);
      } else if (action == 'ArrowUp') {
        setSelected(Math.abs(selected - 1) % entries.length);
      }
    },
    [entries, select, selected],
  );

  useEffect(() => {
    onAction(action);
  }, [action, onAction]);

  return (
    entries.length > 0 && (
      <div className="dropdown">
        <div className="dropdowntext" ref={dropdownRef}>
          {entries.map((entry, index) => {
            return (
              <div
                key={index}
                className={selected == index ? 'selected' : undefined}
                onClick={() => select(index, entry)}
              >
                {entry}
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
