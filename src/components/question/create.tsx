import React, { ReactElement } from 'react';
import { useQuestionCreate } from '../utils/hooks/use-question';
import QuestionForm from './form';

interface Props {
  roomId: number;
}

export default function QuestionCreate({ roomId }: Props): ReactElement {
  return (
    <>
      <h2>Create poll</h2>
      <p>
        Please select a response type for your poll: <b>fix answers</b> or{' '}
        <b>free answers</b>.
      </p>
      <ul>
        <li>
          <b>Fix answers:</b> You create a set of answers and users select one
          of them. After choosing an answer users see the relative amount of
          choices for each answer. Maximun number of answers: 50.
        </li>
        <li>
          <b>Free answers:</b> Users insert their answers in an empty text
          field. Each answer is displayed in a text block. Maximum number of
          characters: 500.
        </li>
      </ul>
      <QuestionForm question={useQuestionCreate(roomId)} roomId={roomId} />
    </>
  );
}
