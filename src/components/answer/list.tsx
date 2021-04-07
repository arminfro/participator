import React, { ReactElement } from 'react';
import { Answer } from '../../types/answer';
import { Question } from '../../types/question';
import ListFixAnswers from './list-fix-answers';
import ListFreeAnswers from './list-free-answers';

interface Props {
  answers: Answer[];
  question: Question;
}

export default function AnswerList({ answers, question }: Props): ReactElement {
  if (answers.length === 0) {
    return <p>There have no answers been given yet to this question</p>;
  }

  const answersFormat = question.answersFormat;

  return (
    <>
      <h2>{question.text}</h2>
      {answersFormat === 'free' && <ListFreeAnswers answers={answers} />}
      {answersFormat === 'fix' && (
        <ListFixAnswers question={question} answers={answers} />
      )}
    </>
  );
}
