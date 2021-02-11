import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import api from '../../../utils/api';
import getInitialProps from '../../../utils/get-initial-props';
import Question from '../../../../types/question';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  questions: Question[];
}

export default function Questions({ questions }: Props): ReactElement {
  const router = useRouter();
  const roomId = router.query.id;

  return (
    <>
      <h2>All polls of this room</h2>
      <ol>
        {questions.map((oneQuestion) => {
          return (
            <li key={oneQuestion.id}>
              <Link
                href="/rooms/[id]/questions/[id]"
                as={`/rooms/${roomId}/questions/${oneQuestion.id}`}
              >
                {oneQuestion.text}
              </Link>
            </li>
          );
        })}
      </ol>
      <Link
        href="/rooms/[id]/questions/new"
        as={`/rooms/${roomId}/questions/new`}
      >
        <button className="ui button blue">Create poll</button>
      </Link>
      <Link href="/rooms/[id]" as={`/rooms/${roomId}`}>
        <button className="ui button yellow">Classroom</button>
      </Link>
    </>
  );
}

Questions.getInitialProps = async ({ req, query }: NextPageContext) => {
  const questions = await getInitialProps<Question>(req, query, {
    server: () => query.questions,
    client: async () => await api('get', `api/rooms/${query.id}/questions`),
  });
  return { questions };
};
