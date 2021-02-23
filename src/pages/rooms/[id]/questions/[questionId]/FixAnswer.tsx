import React, { ReactElement } from 'react';
interface Props {
  fixAnswers: string[];
  setFixAnswer: (s: string) => void;
}

export default function FixAnswer({
  fixAnswers,
  setFixAnswer,
}: Props): ReactElement {
  const choice = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFixAnswer(e.target.value);
  };

  return (
    <div>
      <p>Choose one answer</p>
      {fixAnswers.map((answer: string, index: number) => {
        return (
          <div key={index}>
            <input
              type="radio"
              value={answer}
              onChange={choice}
              name="answerSelection"
            />{` ${answer}`}
          </div>
        );
      })}
    </div>
  );
}
