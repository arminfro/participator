import React, { ReactElement, SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Question, {
  AnswersFormat,
  FixAnswer,
  QuestionCreate,
} from '../../types/question';
import api from '../utils/api';

interface Props extends Partial<QuestionCreate> {
  isEdit: boolean;
}

export default function QuestionForm(props: Props): ReactElement {
  const [text, setText] = useState(props.text);
  const [answersFormat, setAnswersFormat] = useState<AnswersFormat>(
    props.answersFormat,
  );

  const [fixAnswers, setFixAnswers] = useState<FixAnswer[]>(props.fixAnswers);
  const router = useRouter();
  const roomId = router.query.id;
  const questionId = router.query.questionId;

  const answersFormatSelect = (e: any) => {
    setAnswersFormat(e.target.value);
  };

  const onChangeFixAnswer = (newValue: string, index: number) => {
    setFixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      copyFixAnswers[index] = { ...copyFixAnswers[index], answer: newValue };
      return copyFixAnswers;
    });
  };

  const onAddFixAnswer = (e: SyntheticEvent) => {
    e.preventDefault();
    setFixAnswers((currentFixAnswers) => [
      ...currentFixAnswers,
      { answer: '' },
    ]);
  };

  const onRemoveFixAnswer = (e: SyntheticEvent) => {
    e.preventDefault();
    setFixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      if (copyFixAnswers.length > 1) {
        copyFixAnswers.pop();
      }
      return copyFixAnswers;
    });
  };

  const question = (): QuestionCreate => {
    const question: QuestionCreate = {
      text,
      answersFormat,
    };
    if (answersFormat === 'fix') {
      question.fixAnswers = fixAnswers;
    }
    return question;
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    api<Question>(
      props.isEdit ? 'put' : 'post',
      `api/rooms/${roomId}/questions/${props.isEdit ? questionId : ''}`,
      (question) => {
        router.push(`/rooms/${roomId}/questions/${question.id}`);
      },
      question(),
    );
  };

  return (
    <>
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
          />
          {' fix answers '}
          <input
            type="radio"
            value="free"
            checked={answersFormat === 'free'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />
          {' free answers '}
          <input
            type="radio"
            value="range"
            checked={answersFormat === 'range'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />
          {' temperature check '}
        </div>
        <div className="field">
          {answersFormat === 'fix' && (
            <>
              <label>
                <h3>Answers</h3>
              </label>
              {fixAnswers.map((fixAnswer, index) => (
                <div key={index}>
                  <input
                    placeholder={`Answer No.${index + 1}`}
                    value={fixAnswer.answer}
                    onChange={(e) => {
                      onChangeFixAnswer(e.target.value, index);
                    }}
                  />
                </div>
              ))}

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
