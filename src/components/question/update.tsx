import React, { ReactElement } from 'react';
import { Question } from '../../types/question';
import { useQuestionUpdate } from '../utils/hooks/use-question';
import QuestionForm from './form';

interface Props {
  question: Question;
  roomId: number;
  onCloseDrawer: () => void;
}

export default function QuestionUpdate({
  question,
  roomId,
  onCloseDrawer,
}: Props): ReactElement {
  return (
    <QuestionForm
      onCloseDrawer={onCloseDrawer}
      question={useQuestionUpdate(roomId, question.id, question)}
      roomId={roomId}
      questionId={question.id}
    />
  );
}
