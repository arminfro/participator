import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import Answer from '../../types/answer';
import FreeAnswersResults from './FreeAnswersResults';
import FixAnswersResults from './FixAnswersResults';
import RangeAnswersResults from './RangeAnswersResults';
import Link from 'next/link';

interface Props {
  answers: Answer[];
}
export default function AnswerList({ answers }: Props) {
  const router = useRouter();
  const roomId = router.query.id;

  if (answers.length === 0) {
    // qtodo, we don't print the id of the model to the user
    // it's just an internal information
    return (
      <p>
        There have no answers been given yet to question No.
        {router.query.questionId}.
      </p>
    );
  }

  // qtodo, how about saving the question in constant instead of id
  // then we could replace all calls to answers[0]
  // and take the information, for answertype out of the question
  // by accessing property answersFormat of type AnswersFormat
  const questionId = answers[0].question.id;

  return (
    <>
      <h2>{answers[0].question.text}</h2>
      <div className="ui container">
        {answers[0].freeAnswer && <FreeAnswersResults answers={answers} />}
        {answers[0].fixAnswer && <FixAnswersResults answers={answers} />}
        {/* rangeAnswer not yet defined in interface Answer -> quick fix: exclusion of other answer formats*/}
        {/* qtodo, range is defined by answersFormat */}
        {answers[0].freeAnswer === null && answers[0].fixAnswer === null && (
          <RangeAnswersResults answers={answers} />
        )}
      </div>
      <Link href="/rooms/[id]/questions/" as={`/rooms/${roomId}/questions/`}>
        <button className="ui button blue">List of all polls</button>
      </Link>
      <Link
        href="/rooms/[id]/questions/[id]"
        as={`/rooms/${roomId}/questions/${questionId}`}
      >
        <button className="ui button yellow">Back to poll</button>
      </Link>
    </>
  );
}
