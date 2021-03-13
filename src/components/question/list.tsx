import React, { ReactElement } from 'react';
import Question from '../../types/question';

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props): ReactElement {
  return <>{JSON.stringify(questions)}</>;
}
