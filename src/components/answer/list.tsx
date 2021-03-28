import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Answer } from '../../types/answer';
import ListFreeAnswers from './list-free-answers';
import ListFixAnswers from './list-fix-answers';

interface Props {
  answers: Answer[];
}

export default function AnswerList({ answers }: Props): ReactElement {
  const router = useRouter();
  const roomId = router.query.id;

  if (answers.length === 0) {
    return <p>There have no answers been given yet to this question</p>;
  }

  const question = answers[0].question;
  const answersFormat = question.answersFormat;

  return (
    <>
      <h2>{question.text}</h2>
      {answersFormat === 'free' && <ListFreeAnswers answers={answers} />}
      {answersFormat === 'fix' && (
        <ListFixAnswers question={question} answers={answers} />
      )}

      <div className="ui divider" />
      <Link href="/rooms/[id]/questions/" as={`/rooms/${roomId}/questions/`}>
        <button className="ui button blue">List of all polls</button>
      </Link>
      <Link
        href="/rooms/[id]/questions/[id]"
        as={`/rooms/${roomId}/questions/${question.id}`}
      >
        <button className="ui button yellow">Back to poll</button>
      </Link>
    </>
  );
}
