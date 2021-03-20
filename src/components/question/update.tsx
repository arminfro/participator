import React, { ReactElement } from 'react';
import Question from '../../types/question';
import QuestionForm from './form';

interface Props {
  question: Question;
}

export default function QuestionUpdate({ question }: Props): ReactElement {
  return (
    <>
      <h2> Edit poll</h2>
      <QuestionForm
        text={question.text}
        answersFormat={question.answersFormat}
        fixAnswers={question.fixAnswers}
        isEdit={true}
      />
    </>
  );
}
