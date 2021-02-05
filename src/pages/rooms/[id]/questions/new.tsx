// Antwortfelder -> Anzahl: wie wird sie immer wieder auf 0 gesetzt?
// Antwortfelder -> Anzahl: wie vermeiden wir Dopplung?

import React, { ReactElement, SyntheticEvent, useState } from 'react';
import { AnswersFormat, QuestionCreate } from '../../../../types/question';
import api from '../../../utils/api';
import { Router, useRouter } from 'next/router';
import { Question } from '../../../../server/questions/question.entity';

export default function QuestionNew(): ReactElement {
  const [poll, setPoll] = useState('');
  const [fixedAnswers, setFixedAnswers] = useState(['']);
  // eslint-disable-next-line prettier/prettier
  const [answersFormat, setAnswersFormat] = useState<'free' | 'fixed' | 'range'>();
  const router = useRouter();

  const roomId = router.query.id;
  const answersFormatSelect = (e) => {
    setAnswersFormat(e.target.value);
  };

  const onChangeFixedAnswer = (newValue: string, index: number) => {
    setFixedAnswers((currentFixedAnswers) => {
      const copyFixedAnswers = [...currentFixedAnswers];
      copyFixedAnswers[index] = newValue;
      return copyFixedAnswers;
    });
  };

  const onAddFixedAnswer = () => {
    setFixedAnswers((currentFixedAnswers) => [...currentFixedAnswers, '']);
  };

  const onRemoveFixedAnswer = () => {
    setFixedAnswers((currentFixedAnswers) => {
      const copyFixedAnswers = [...currentFixedAnswers];
      if (copyFixedAnswers.length > 1) {
        currentFixedAnswers.pop();
      }
      return copyFixedAnswers;
    });
  };

  const question = (): QuestionCreate => {
    return {
      text: poll,
      answersFormat: {
        fixed: answersFormat === 'fixed' && fixedAnswers,
        free: answersFormat === 'free' && '',
        range: answersFormat === 'range' ? 10 : false,
      },
    };
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    api<Question>(
      'post',
      `api/rooms/${roomId}/questions`,
      (question) => {
        console.log(question);
        Router.push(`/rooms/${roomId}/questions/${question.id}`);
      },
      question(),
    );
  };

  return (
    <>
      <h2>Create poll</h2>
      <p>
        Please select a response type for your poll: <b>fixed answers</b>,{' '}
        <b>free answers</b> or <b>temperature check</b>.
      </p>
      <ul>
        <li>
          <b>Fixed answers:</b> You create a set of answers and users select one
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
      <form className="ui form" onSubmit={onSubmit}>
        <div className="field">
          <label>
            <h3>Your polling question</h3>
          </label>
          <input
            type="text"
            value={poll}
            placeholder="Type your question"
            onChange={(e) => {
              setPoll(e.target.value);
            }}
          />
        </div>
        <div className="field">
          <label>
            <h3>Your answer type</h3>
          </label>
          <input
            type="radio"
            value="fixed"
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />{' '}
          fix answers
          <input
            type="radio"
            value="free"
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />{' '}
          free answers
          <input
            type="radio"
            value="range"
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />{' '}
          temperature check
        </div>
        <div className="field">
          {answersFormat === 'fixed' && (
            <>
              <label>
                <h3>Answers</h3>
              </label>
              {fixedAnswers.map((answer, index) => {
                return (
                  <div key={index}>
                    <input
                      placeholder={`Type answer No.${index + 1}`}
                      value={answer}
                      onChange={(e) => {
                        onChangeFixedAnswer(e.target.value, index);
                      }}
                    />
                  </div>
                );
              })}

              <button
                onClick={onAddFixedAnswer}
                className="ui mini button blue"
              >
                +
              </button>
              <button
                onClick={onRemoveFixedAnswer}
                className="ui mini button red"
              >
                -
              </button>
            </>
          )}
        </div>
        <div>
          <button className="ui button green">Submit</button>
        </div>
      </form>
    </>
  );
}
