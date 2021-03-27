import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../../../../types/question';
import QuestionUpdate from '../../../../../components/question/update';
import Fetch from '../../../../../components/utils/fetch';

export default function QuestionEdit(): ReactElement {
  const { id, questionId } = useRouter().query;
  return (
    <Fetch<Question> url={`api/rooms/${id}/questions/${questionId}`}>
      {(question) => <QuestionUpdate question={question} />}
    </Fetch>
  );
}
