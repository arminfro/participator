import Link from 'next/link';
import React, { ReactElement } from 'react';
import { Question } from '../../types/question';
import AnswerCreate from '../answer/create';

interface Props {
  question: Question;
  roomId: number;
}

export default function QuestionDetails({
  question,
  roomId,
}: Props): ReactElement {
  return <AnswerCreate question={question} roomId={roomId} />;
}
