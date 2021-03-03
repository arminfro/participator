import React, { ReactElement, useEffect, useState } from 'react';

export interface Position {
  x: number;
  y: number;
}

interface Props {
  entries: string[];
  selectAtMention: (value: string) => void;
  action: string;
}

export default function Dropdown({
  entries,
  selectAtMention,
  action,
}: Props): ReactElement {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (action === 'Enter') {
      selectAtMention(entries[selected]);
    }
  }, [action, entries, selected, selectAtMention]);

  useEffect(() => {
    if (action === 'ArrowUp' || action === 'ArrowDown') {
      if (action === 'ArrowDown') {
        setSelected(
          (currentSelected) => (currentSelected + 1) % entries.length,
        );
      } else if (action === 'ArrowUp') {
        setSelected(
          (currentSelected) => Math.abs(currentSelected - 1) % entries.length,
        );
      }
    }
  }, [action, entries.length]);

  return (
    entries.length > 0 && (
      <div className="dropdown">
        <div className="dropdowntext">
          <div>
            {entries.map((entry, index) => (
              <div
                key={index}
                className={selected === index ? 'selected' : undefined}
              >
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
