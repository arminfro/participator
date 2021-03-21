import React, { ReactElement } from 'react';
import QuestionForm from './form';

export default function QuestionCreate(): ReactElement {
  return (
    <>
      <h2>Create poll</h2>
      <p>
        Please select a response type for your poll: <b>fix answers</b>,{' '}
        <b>free answers</b> or <b>temperature check</b>.
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
        <li>
          Temperature check: You create a question to which the answer can be
          given on a scale from 1 to 10. Users can only select one number. Every
          response is visualised in a histogram.
        </li>
      </ul>
      <QuestionForm
        text=""
        answersFormat="fix"
        fixAnswers={[{ answer: '' }]}
        isEdit={false}
      />
    </>
  );
}
