import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../types/question';

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props): ReactElement {
  const router = useRouter();
  const roomId = router.query.id;

  return (
    <>
      <h2>All polls of this room</h2>
      <ol>
        {questions.map((question) => (
          <li key={question.id}>
            <Link
              href="/rooms/[id]/questions/[id]"
              as={`/rooms/${roomId}/questions/${question.id}`}
            >
              {question.text}
            </Link>
          </li>
        ))}
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
