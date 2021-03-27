import React, { ReactElement } from 'react';
import { Question } from '../../types/question';
import { useQuestionUpdate } from '../utils/hooks/use-question';
import QuestionForm from './form';

interface Props {
  question: Question;
  roomId: number;
}

export default function QuestionUpdate({
  question,
  roomId,
}: Props): ReactElement {
  return (
    <>
      <h2> Edit poll</h2>
      <QuestionForm
        question={useQuestionUpdate(roomId, question.id, question)}
        roomId={roomId}
        questionId={question.id}
      />
    </>
  );
}
