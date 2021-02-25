import React, { ReactElement, useEffect, useRef, useState } from 'react';

export interface Position {
  x: number;
  y: number;
}

interface Props {
  entries: string[];
  callback: (value: string) => void;
  action: string;
}

export default function Dropdown({
  entries,
  callback,
  action,
}: Props): ReactElement {
  const [selected, setSelected] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    onAction(action);
  }, [action]);

  const select = (i: number, element: string) => {
    callback(element);
  };

  const onAction = (action: string): void => {
    if (action == 'Enter') {
      select(selected, entries[selected]);
    } else if (action == 'ArrowDown') {
      setSelected((selected + 1) % entries.length);
    } else if (action == 'ArrowUp') {
      setSelected(Math.abs(selected - 1) % entries.length);
    }
  };

  return (
    entries.length > 0 && (
      <div className="dropdown">
        <div className="dropdowntext" ref={dropdownRef}>
          {entries.map((e, i) => {
            return (
              <div
                key={i}
                className={selected === i ? 'selected' : undefined}
                onClick={() => select(i, e)}
              >
                {e}
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
