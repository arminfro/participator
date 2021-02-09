import React, { ReactElement, SyntheticEvent } from 'react';
import { NextPageContext } from 'next';
import api from '../../../../utils/api';
import getInitialProps from '../../../../utils/get-initial-props';
import IQuestion from '../../../../../types/question';
import FreeAnswer from './FreeAnswer';
import RangeAnswer from './RangeAnswer';
import FixAnswer from './FixAnswer';
import { useRouter } from 'next/router';
import Answer from '../../../../../types/answer';

interface Props {
  question: IQuestion;
}

export default function Question({ question }: Props): ReactElement {
  const FORMAT = question.answersFormat;
  const router = useRouter();
  const roomId = router.query.id;
  const test = (a): string => {
    console.log(a)
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('Test');
    api<Answer>(
      'post',
      `api/rooms/${roomId}/questions/api/rooms/{roomId}/questions/{questionId}/answers`,
      (question) => {
        console.log(question);
        router.push(`/rooms/${roomId}/questions/${question.id}/answers`);
      },
      test(question),
    );
  };

  return (
    <>
      {JSON.stringify(question)}
      {console.log(question)}
      <h4>Poll No.{question.id}</h4>
      <p>
        Created at: <b>{question.createdAt.toLocaleDateString()}</b>
      </p>
      <h4>Poll question</h4>
      <p>{question.text}</p>
      <h4>Answer</h4>
      <form className="ui form" onSubmit={onSubmit}>
        {FORMAT.range === 10 && <RangeAnswer />}
        {FORMAT.range === false && FORMAT.free === false && (
          <FixAnswer question={question} />
        )}
        {FORMAT.free === '' && <FreeAnswer />}
        <div>
          <button className="ui button green">Submit</button>
        </div>
      </form>
    </>
  );
}

Question.getInitialProps = async ({ req, query }: NextPageContext) => {
  const question = await getInitialProps<IQuestion>(req, query, {
    server: () => query.question,
    client: async () =>
      await api('get', `api/rooms/${query.id}/questions/${query.questionId}`),
  });
  return { question };
};
