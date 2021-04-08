import React, { ReactElement } from 'react';
import { Answer } from '../../types/answer';
import { Question } from '../../types/question';
import AnswerCreate from '../answer/create';
import ListFixAnswers from '../answer/list-fix-answers';
import ListFreeAnswers from '../answer/list-free-answers';

interface Props {
  question: Question;
  answers: Answer[];
  roomId: number;
}

export default function QuestionDetails({
  question,
  answers,
  roomId,
}: Props): ReactElement {
  const answersFormat = question.answersFormat;

  return (
    <>
      <h2>Create Answer</h2>
      {/* todo, show form only if not answered yet, ensure on server side */}
      <AnswerCreate question={question} roomId={roomId} />
      {answers.length > 0 && (
        <>
          <h2>Current Answers</h2>
          {answersFormat === 'free' && <ListFreeAnswers answers={answers} />}
          {answersFormat === 'fix' && (
            <ListFixAnswers question={question} answers={answers} />
          )}
        </>
      )}
    </>
  );
}
