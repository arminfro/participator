import React, { ReactElement, SyntheticEvent, useState } from 'react';
import { NextPageContext } from 'next';
import api from '../../../../utils/api';
import getInitialProps from '../../../../utils/get-initial-props';
import IQuestion from '../../../../../types/question';
import FreeAnswer from './FreeAnswer';
import RangeAnswer from './RangeAnswer';
import FixAnswer from './FixAnswer';
import { useRouter } from 'next/router';
import Answer, { AnswerCreate } from '../../../../../types/answer';
import Link from 'next/link';

interface Props {
  question: IQuestion;
}

export default function Question({ question }: Props): ReactElement {
  const [rangeAnswer, setRangeAnswer] = useState<number | undefined>();
  const [fixAnswer, setFixAnswer] = useState('');
  const [freeAnswer, setFreeAnswer] = useState('');
  const format = question.answersFormat;
  const router = useRouter();
  const questionId = question.id;
  const roomId = router.query.id;

  const answerCreate = (): AnswerCreate => {
    if (question.answersFormat === 'range') {
      return { rangeAnswer };
    } else if (question.answersFormat === 'fix') {
      return { fixAnswer };
    } else if (question.answersFormat === 'free') {
      return { freeAnswer };
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (rangeAnswer || fixAnswer || freeAnswer) {
      api<Answer>(
        'post',
        `api/rooms/${roomId}/questions/${questionId}/answers`,
        () => {
          router.push(`/rooms/${roomId}/questions/${questionId}/answers`);
        },
        answerCreate(),
      );
    }
  };

  return (
    <>
      <h4>Poll No.{question.id}</h4>
      <p>
        Created at: <b>{question.createdAt.toLocaleDateString()}</b>
      </p>
      <h4>Poll question</h4>
      <p>{question.text}</p>
      <h4>Answer</h4>
      <form className="ui form" onSubmit={onSubmit}>
        {format === 'range' && <RangeAnswer setRangeAnswer={setRangeAnswer} />}
        {format === 'fix' && (
          <FixAnswer
            setFixAnswer={setFixAnswer}
            fixAnswers={question.fixAnswers}
          />
        )}
        {format === 'free' && <FreeAnswer setFreeAnswer={setFreeAnswer} />}
        <p></p>
        <button className="ui button green">Submit</button>
      </form>
      <p></p>
      <div>
        <Link href="/rooms/[id]/questions/" as={`/rooms/${roomId}/questions/`}>
          <button className="ui button blue">List of all polls</button>
        </Link>
      </div>
      <p></p>
      <div>
        <Link
          href="/rooms/[id]/questions/[id]/edit"
          as={`/rooms/${roomId}/questions/${questionId}/edit`}
        >
          <button className="ui button orange">Edit</button>
        </Link>
      </div>
    </>
  );
}

Question.getInitialProps = async ({ req, query }: NextPageContext) => {
  const question = await getInitialProps<IQuestion>(
    req,
    query,
    {
      server: () => query.question,
      client: async () =>
        await api('get', `api/rooms/${query.id}/questions/${query.questionId}`),
    },
    ['answers'],
  );
  return { question };
};
