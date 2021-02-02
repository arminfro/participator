import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import api from '../../../../utils/api';
import getInitialProps from '../../../../utils/get-initial-props';
import IQuestion from '../../../../../types/question';

interface Props {
  question: IQuestion;
}

export default function Question({ question }: Props): ReactElement {
  return <>{JSON.stringify(question)}</>;
}

Question.getInitialProps = async ({ req, query }: NextPageContext) => {
  const question = await getInitialProps<Question>(req, query, {
    server: () => query.question,
    client: async () =>
      await api('get', `api/rooms/${query.id}/questions/${query.questionId}`),
  });
  return { question };
};
