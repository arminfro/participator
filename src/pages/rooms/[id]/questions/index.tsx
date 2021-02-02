import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import api from '../../../utils/api';
import getInitialProps from '../../../utils/get-initial-props';
import Question from '../../../../types/question';

interface Props {
  questions: Question[];
}

export default function Questions({ questions }: Props): ReactElement {
  return <>{JSON.stringify(questions)}</>;
}

Questions.getInitialProps = async ({ req, query }: NextPageContext) => {
  const questions = await getInitialProps<Question>(req, query, {
    server: () => query.questions,
    client: async () => await api('get', `api/rooms/${query.id}/questions`),
  });
  return { questions };
};
