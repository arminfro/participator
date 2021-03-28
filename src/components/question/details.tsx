import Link from 'next/link';
import React, { ReactElement } from 'react';
import { Question } from '../../types/question';
import AnswerCreate from '../answer/create';

interface Props {
  question: Question;
  roomId: number;
}

export default function QuestionDetails({
  question,
  roomId,
}: Props): ReactElement {
  return (
    <>
      <h4>Poll No.{question.id}</h4>
      <p>
        Created at: <b>{question.createdAt.toLocaleDateString()}</b>
      </p>
      <h4>Poll question</h4>
      <p>{question.text}</p>
      <AnswerCreate question={question} roomId={roomId} />
      <div>
        <Link href="/rooms/[id]/questions/" as={`/rooms/${roomId}/questions/`}>
          <button className="ui button blue">List of all polls</button>
        </Link>
        <Link
          href="/rooms/[id]/questions/[id]/edit"
          as={`/rooms/${roomId}/questions/${question.id}/edit`}
        >
          <button className="ui button orange">Edit</button>
        </Link>
      </div>
    </>
  );
}
