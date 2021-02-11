import React from 'react';

interface Props {
  setFreeAnswer: any;
}
export default function FreeAnswer({ setFreeAnswer }: Props) {
  return (
    <textarea
      onChange={(e) => {
        setFreeAnswer(e.target.value);
      }}
    />
  );
}
