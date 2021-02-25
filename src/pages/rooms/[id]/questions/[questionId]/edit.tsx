import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import api from '../../../../utils/api';
import getInitialProps from '../../../../utils/get-initial-props';
import Question from '../../../../../types/question';
import QuestionForm from '../form';

interface Props {
  question: Question;
}

export default function QuestionEdit({ question }: Props): ReactElement {
  console.log(question);
  return (
    <>
      <h2> Edit poll</h2>
      <QuestionForm
        text={question.text}
        answersFormat={question.answersFormat}
        fixAnswers={question.fixAnswers}
        isEdit={true}
      />
    </>
  );
}
QuestionEdit.getInitialProps = async ({ req, query }: NextPageContext) => {
  const question = await getInitialProps<Question>(req, query, {
    server: () => query.question,
    client: async () =>
      await api('get', `api/rooms/${query.id}/questions/${query.questionId}`),
  });
  return { question };
};
