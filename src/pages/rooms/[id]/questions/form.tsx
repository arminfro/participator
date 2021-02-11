import React, { ReactElement, SyntheticEvent, useState } from 'react';
// eslint-disable-next-line prettier/prettier
import Question, { AnswersFormat, QuestionCreate } from '../../../../types/question';
import api from '../../../utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Props extends QuestionCreate {
  isEdit: boolean;
}

export default function QuestionForm(props: Props): ReactElement {
  const [text, setText] = useState(props.text);
  const [fixAnswers, setFixAnswers] = useState(props.fixAnswers);
  const [answersFormat, setAnswersFormat] = useState<AnswersFormat>(
    props.answersFormat,
  );
  const router = useRouter();
  const roomId = router.query.id;
  const answersFormatSelect = (e: any) => {
    setAnswersFormat(e.target.value);
  };

  const onChangeFixAnswer = (newValue: string, index: number) => {
    setFixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      copyFixAnswers[index] = newValue;
      return copyFixAnswers;
    });
  };

  const onAddFixAnswer = (e: SyntheticEvent) => {
    e.preventDefault();
    setFixAnswers((currentFixAnswers) => [...currentFixAnswers, '']);
  };

  const onRemoveFixAnswer = (e: SyntheticEvent) => {
    e.preventDefault();
    setFixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      if (copyFixAnswers.length > 1) {
        currentFixAnswers.pop();
      }
      return copyFixAnswers;
    });
  };

  const question = (): QuestionCreate => {
    return {
      text,
      answersFormat,
      fixAnswers: answersFormat === 'fix' && fixAnswers,
    };
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    api<Question>(
      'post',
      `api/rooms/${roomId}/questions`,
      (question) => {
        router.push(`/rooms/${roomId}/questions/${question.id}`);
      },
      question(),
    );
  };

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
      <form className="ui form" onSubmit={onSubmit}>
        <div className="field">
          <label>
            <h3>Your polling question</h3>
          </label>
          <input
            type="text"
            value={text}
            placeholder="Type your question"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
        <div className="field">
          <label>
            <h3>Your answer type</h3>
          </label>
          <input
            type="radio"
            value="fix"
            checked={answersFormat === 'fix'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />{' '}
          fix answers
          <input
            type="radio"
            value="free"
            checked={answersFormat === 'free'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />{' '}
          free answers
          <input
            type="radio"
            value="range"
            checked={answersFormat === 'range'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />{' '}
          temperature check
        </div>
        <div className="field">
          {answersFormat === 'fix' && (
            <>
              <label>
                <h3>Answers</h3>
              </label>
              {fixAnswers.map((answer, index) => {
                return (
                  <div key={index}>
                    <input
                      placeholder={`Type answer No.${index + 1}`}
                      value={answer}
                      onChange={(e) => {
                        onChangeFixAnswer(e.target.value, index);
                      }}
                    />
                  </div>
                );
              })}

              <button onClick={onAddFixAnswer} className="ui mini button blue">
                +
              </button>
              <button
                onClick={onRemoveFixAnswer}
                className="ui mini button red"
              >
                -
              </button>
            </>
          )}
        </div>
        <div>
          <button className="ui button green">Submit</button>
          <Link
            href="/rooms/[id]/questions/"
            as={`/rooms/${roomId}/questions/`}
          >
            <button className="ui button blue">List of all polls</button>
          </Link>
          <Link href="/rooms/[id]" as={`/rooms/${roomId}`}>
            <button className="ui button yellow">Classroom</button>
          </Link>
        </div>
      </form>
    </>
  );
}
