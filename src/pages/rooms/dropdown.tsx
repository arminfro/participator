import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface Position {
  x: number,
  y: number
}

interface Props {
  entries: string[];
  callback: (index: number, value: string) => void
  action: string
}


export default function Dropdown({ entries, callback, action }: Props) {
  const [selected, setSelected] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {

    onAction(action)
    return

  }, [action])

  const select = (
    i: number,
    element: string
  ) => { callback(i, element); };

  const onAction = (action: string) => {
    if (action == 'Enter') {
      select(selected, entries[selected]);
    } else if (action == 'ArrowDown') {
      setSelected((selected + 1) % entries.length)
    } else if (action == 'ArrowUp') {
      setSelected((Math.abs(selected - 1)) % entries.length)
    }
  };

  return (
    <div className="dropdown" >
      <input type="hidden" name="input"></input>
      <div className="dropdowntext" ref={dropdownRef}>
        {entries.map((e, i) => {
          return (
            <div key={i} data-value={i} className={(selected == i) ? "selected" : ""} onClick={(ev) => select(i, e)}>
              {e}
            </div>
          );
        })}
      </div>
    </div>
  );
}
