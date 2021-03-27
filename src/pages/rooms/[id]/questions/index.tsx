import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../../../types/question';
import QuestionList from '../../../../components/question/list';
import Fetch from '../../../../components/utils/fetch';

export default function QuestionIndex(): ReactElement {
  const router = useRouter();
  return (
    <Fetch<Question[]> url={`api/rooms/${router.query.id}/questions`}>
      {(questions) => <QuestionList questions={questions} />}
    </Fetch>
  );
}
