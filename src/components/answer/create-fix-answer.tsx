import React, { ReactElement, ChangeEvent } from 'react';
import { FixAnswer as IFixAnswer } from '../../types/question';

interface Props {
  fixAnswers: IFixAnswer[];
  setFixAnswerId: (id: number) => void;
}

export default function CreateFixAnswer({
  fixAnswers,
  setFixAnswerId,
}: Props): ReactElement {
  const choice = (e: ChangeEvent<HTMLInputElement>): void => {
    setFixAnswerId(Number(e.target.value));
  };

  return (
    <div>
      <p>Choose one answer</p>
      {fixAnswers.map((fixAnswer, index: number) => {
        return (
          <div key={index}>
            <input
              type="radio"
              value={fixAnswer.id}
              onChange={choice}
              name="answerSelection"
            />
            {` ${fixAnswer.text}`}
          </div>
        );
      })}
    </div>
  );
}
