import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import Question from '../../types/question';

interface Props {
  question: Question;
}

export default function QuestionDetails({ question }: Props): ReactElement {
  return <>{JSON.stringify(question)}</>;
}
