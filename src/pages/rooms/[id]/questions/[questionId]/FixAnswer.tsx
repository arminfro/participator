import React, { ReactElement, ChangeEvent } from 'react';
import { FixAnswer as IFixAnswer } from '../../../../../types/question';
interface Props {
  fixAnswers: IFixAnswer[];
  setFixAnswer: (s: string) => void;
}

export default function FixAnswer({
  fixAnswers,
  setFixAnswer,
}: Props): ReactElement {
  const choice = (e: ChangeEvent<HTMLInputElement>): void => {
    setFixAnswer(e.target.value);
  };

  return (
    <div>
      <p>Choose one answer</p>
      {fixAnswers.map((fixAnswer, index: number) => {
        return (
          <div key={index}>
            <input
              type="radio"
              value={fixAnswer.answer}
              onChange={choice}
              name="answerSelection"
            />
            {` ${fixAnswer.answer}`}
          </div>
        );
      })}
    </div>
  );
}
