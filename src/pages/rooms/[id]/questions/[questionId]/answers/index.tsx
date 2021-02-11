import { useRouter } from 'next/router';
import React from 'react';
import Answer from '../../../../../../types/answer';
import { NextPageContext } from 'next';
import api from '../../../../../utils/api';
import getInitialProps from '../../../../../utils/get-initial-props';
import Link from 'next/link';
import FreeAnswersResults from './FreeAnswersResults';
import FixAnswersResults from './FixAnswersResults';
import RangeAnswersResults from './RangeAnswersResults';

interface Props {
  answers: Answer[];
}
export default function Answers({ answers }: Props) {
  const router = useRouter();
  const roomId = router.query.id;
  const questionId = answers[0].question.id;

  return (
    <>
      <h2>{answers[0].question.text}</h2>
      <div className="ui container">
        {answers[0].freeAnswer !== null && (
          <FreeAnswersResults answers={answers} />
        )}
        {answers[0].fixAnswer !== null && (
          <FixAnswersResults answers={answers} />
        )}
        {/* rangeAnswer not yet defined in interface Answer -> quick fix: exclusion of other answer formats*/}
        {answers[0].freeAnswer === null && answers[0].fixAnswer === null && (
          <RangeAnswersResults answers={answers} />
        )}
      </div>
      <Link href="/rooms/[id]/questions/" as={`/rooms/${roomId}/questions/`}>
        <button className="ui button blue">List of all polls</button>
      </Link>
      <Link
        href="/rooms/[id]/questions/[id]"
        as={`/rooms/${roomId}/questions/${questionId}`}
      >
        <button className="ui button yellow">Back to poll</button>
      </Link>
    </>
  );
}

Answers.getInitialProps = async ({ req, query }: NextPageContext) => {
  const answers = await getInitialProps<Answer>(req, query, {
    server: () => query.answers,
    client: async () =>
      await api(
        'get',
        `api/rooms/${query.id}/questions/${query.questionId}/answers/`,
      ),
  });
  return { answers };
};
