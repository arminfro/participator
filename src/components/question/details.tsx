import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent, useState } from 'react';
import Answer, { AnswerCreate } from '../../types/answer';
import { Question } from '../../types/question';
import FixAnswer from '../answer/FixAnswer';
import FreeAnswer from '../answer/FreeAnswer';
import api from '../utils/api';

interface Props {
  question: Question;
}

export default function QuestionDetails({ question }: Props): ReactElement {
  const [fixAnswerId, setFixAnswerId] = useState<number>();
  const [freeAnswer, setFreeAnswer] = useState('');

  const format = question.answersFormat;
  const router = useRouter();
  const questionId = question.id;
  const roomId = router.query.id;

  const answerCreate = (): AnswerCreate => {
    if (question.answersFormat === 'fix') {
      return { fixAnswerId };
    } else if (question.answersFormat === 'free') {
      return { freeAnswer };
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (fixAnswerId || freeAnswer) {
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
        {format === 'fix' && (
          <FixAnswer
            setFixAnswerId={setFixAnswerId}
            fixAnswers={question.fixAnswers}
          />
        )}
        {format === 'free' && <FreeAnswer setFreeAnswer={setFreeAnswer} />}
        <button className="ui button green">Submit</button>
      </form>
      <div>
        <Link href="/rooms/[id]/questions/" as={`/rooms/${roomId}/questions/`}>
          <button className="ui button blue">List of all polls</button>
        </Link>
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
