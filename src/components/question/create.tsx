import React, { ReactElement } from 'react';
import { useQuestionCreate } from '../utils/hooks/use-question';
import QuestionForm from './form';

interface Props {
  roomId: number;
  onCloseDrawer?: () => void;
}

export default function QuestionCreate({
  roomId,
  onCloseDrawer,
}: Props): ReactElement {
  return (
    <>
      <p>
        Please select a response type for your poll: <b>fix answers</b> or{' '}
        <b>free answers</b>.
      </p>
      <ul>
        <li>
          <b>Fix answers:</b> You create a set of answers and users select one
          of them. After choosing an answer users see the relative amount of
          choices for each answer.
        </li>
        <li>
          <b>Free answers:</b> Users insert their answers in an empty text
          field. Each answer is displayed in a text block.
        </li>
      </ul>
      <QuestionForm
        question={useQuestionCreate(roomId)}
        onCloseDrawer={onCloseDrawer}
      />
    </>
  );
}
