import React from 'react';

interface Props {
  setFreeAnswer: (answer: string) => void;
}
export default function CreateFreeAnswer({ setFreeAnswer }: Props) {
  return (
    <textarea
      maxLength={500}
      onChange={(e) => {
        setFreeAnswer(e.target.value);
      }}
    />
  );
}
