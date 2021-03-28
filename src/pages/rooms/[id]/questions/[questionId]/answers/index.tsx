import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Answer } from '../../../../../../types/answer';
import Fetch from '../../../../../../components/utils/fetch';
import AnswerList from '../../../../../../components/answer/list';

export default function AnswerIndex(): ReactElement {
  const { id, questionId } = useRouter().query;
  return (
    <Fetch<Answer[]> url={`api/rooms/${id}/questions/${questionId}/answers`}>
      {(answers) => <AnswerList answers={answers} />}
    </Fetch>
  );
}
