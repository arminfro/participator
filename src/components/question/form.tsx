import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent } from 'react';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { UseStructWithValidation } from '../utils/hooks/use-struct';

interface Props {
  question: UseStructWithValidation<QuestionCreate | QuestionUpdate>;
  roomId: number;
  questionId?: number;
}

const presets = [
  {
    label: 'From 1 to 10',
    fixAnswers: [
      { answer: '1' },
      { answer: '2' },
      { answer: '3' },
      { answer: '4' },
      { answer: '5' },
      { answer: '6' },
      { answer: '7' },
      { answer: '8' },
      { answer: '9' },
      { answer: '10' },
    ],
  },
];

export default function QuestionForm({
  question,
  roomId,
  questionId,
}: Props): ReactElement {
  const router = useRouter();

  const answersFormatSelect = (e: any) => {
    question.set.answersFormat(e.target.value);
  };

  const onChangeFixAnswer = (newValue: string, index: number) => {
    const newFixAnswers = (currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      copyFixAnswers[index] = { ...copyFixAnswers[index], answer: newValue };
      return copyFixAnswers;
    };
    question.set.fixAnswers(newFixAnswers(question.get.fixAnswers));
  };

  const onAddFixAnswer = (e: SyntheticEvent) => {
    e.preventDefault();
    const newCurrentAnswers = (currentFixAnswers) => [
      ...currentFixAnswers,
      { answer: '' },
    ];
    question.set.fixAnswers(newCurrentAnswers(question.get.fixAnswers));
  };

  const onRemoveFixAnswer = (e: SyntheticEvent) => {
    e.preventDefault();
    const newFixAnswers = (currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      if (copyFixAnswers.length > 1) {
        copyFixAnswers.pop();
      }
      return copyFixAnswers;
    };
    question.set.fixAnswers(newFixAnswers(question.get.fixAnswers));
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    question.sync(() => {
      router.push(
        `/rooms/${roomId}/questions${questionId ? `/${questionId}` : ''}`,
      );
    });
  };

  return (
    <>
      <form className="ui form" onSubmit={onSubmit}>
        <div className="field">
          <label>
            <h3>Your answer type</h3>
          </label>
          <input
            type="radio"
            value="fix"
            checked={question.get.answersFormat === 'fix'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />
          {' fix answers '}
          <input
            type="radio"
            value="free"
            checked={question.get.answersFormat === 'free'}
            onChange={answersFormatSelect}
            name="typeOfAnswer"
          />
          {' free answers '}
        </div>
        <div className="field">
          {question.get.answersFormat === 'fix' && (
            <>
              <label>
                <h3>Choose a Preset</h3>
              </label>
              {presets.map((preset) => (
                <button
                  className="ui button"
                  key={preset.label}
                  type="button"
                  onClick={() => question.set.fixAnswers(preset.fixAnswers)}
                >
                  {preset.label}
                </button>
              ))}
            </>
          )}
          <div className="ui divider" />
          <label>
            <h3>Your polling question</h3>
          </label>
          <input
            type="text"
            value={question.get.text}
            placeholder="Type your question"
            onChange={(e) => {
              question.set.text(e.target.value);
            }}
          />
        </div>
        <div className="ui divider" />
        <div className="field">
          {question.get.answersFormat === 'fix' && (
            <>
              <label>
                <h3>Answers</h3>
                <button
                  onClick={onAddFixAnswer}
                  className="ui mini button blue"
                >
                  +
                </button>
                <button
                  onClick={onRemoveFixAnswer}
                  className="ui mini button red"
                >
                  -
                </button>
              </label>
              {question.get.fixAnswers.map((fixAnswer, index) => (
                <input
                  key={index}
                  className="eight wide field"
                  placeholder={`Answer No.${index + 1}`}
                  value={fixAnswer.answer}
                  onChange={(e) => {
                    onChangeFixAnswer(e.target.value, index);
                  }}
                />
              ))}
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
