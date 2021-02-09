import React, { ReactElement, SyntheticEvent } from 'react';
import { Answer } from '../../../../../../dist/src/server/answers/answer.entity';
import IQuestion from '../../../../../types/question';

interface Props {
  question: IQuestion;
}

export default function FixAnswer({ question }: Props): ReactElement {
  const ANSWERS = question.answersFormat.fixed;
  //const ANSWER_CHOICE = answer.target.value;
  console.log(ANSWERS);

  const CHOICE = (answer: any) => {
    console.log(answer.target.value);
    return answer.target.value;
  };


  return (
    <div>
      <p>Choose one answer</p>
      {ANSWERS.map((answer: string, index: number) => {
        return (
          <div key={index}>
            <input
              type="radio"
              value={answer}
              onClick={CHOICE}
              name="answerSelection"
            />{' '}
            {answer}
          </div>
        );
      })}

    </div>
  );
}
