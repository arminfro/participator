import React from 'react';

interface Props {
  setFreeAnswer: (s: string) => void;
}
export default function FreeAnswer({ setFreeAnswer }: Props) {
  return (
    <textarea
      maxLength={500}
      onChange={(e) => {
        setFreeAnswer(e.target.value);
      }}
    />
  );
}
