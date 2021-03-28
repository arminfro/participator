import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent } from 'react';
import { Question } from '../../types/question';
import FreeAnswer from '../answer/create-free-answer';
import { useAnswerCreate } from '../utils/hooks/use-answer';
import FixAnswer from './create-fix-answer';

interface Props {
  question: Question;
  roomId: number;
}

export default function AnswerCreate({
  question,
  roomId,
}: Props): ReactElement {
  const router = useRouter();
  const answer = useAnswerCreate(roomId, question.id);

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (answer.get.fixAnswerId || answer.get.freeAnswer) {
      answer.sync(() => {
        router.push(`/rooms/${roomId}/questions/${question.id}/answers`);
      });
    }
  };
  return (
    <>
      <h4>Answer</h4>
      <form className="ui form" onSubmit={onSubmit}>
        {question.answersFormat === 'fix' && (
          <FixAnswer
            setFixAnswerId={(id) => answer.set.fixAnswerId(id)}
            fixAnswers={question.fixAnswers}
          />
        )}
        {question.answersFormat === 'free' && (
          <FreeAnswer setFreeAnswer={(text) => answer.set.freeAnswer(text)} />
        )}
        <button className="ui button green">Submit</button>
      </form>
    </>
  );
}
