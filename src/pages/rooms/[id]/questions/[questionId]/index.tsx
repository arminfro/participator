import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../../../../types/question';
import QuestionDetails from '../../../../../components/question/details';
import Fetch from '../../../../../components/utils/fetch';

export default function QuestionEdit(): ReactElement {
  const { id, questionId } = useRouter().query;
  return (
    <Fetch<Question> url={`api/rooms/${id}/questions/${questionId}`}>
      {(question) => <QuestionDetails question={question} />}
    </Fetch>
  );
}
