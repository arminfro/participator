import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { AnswerCreate as IAnswerCreate } from '../../types/answer';
import { Question } from '../../types/question';
import FormContainer from '../utils/container/form';
import { useAnswerCreate } from '../utils/hooks/use-answer';

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

  const onSubmit = () => {
    if (answer.get.fixAnswerId || answer.get.freeAnswer) {
      router.push(`/rooms/${roomId}/questions/${question.id}`);
    }
  };

  return (
    <>
      <FormContainer<IAnswerCreate>
        onSubmit={onSubmit}
        struct={answer}
        items={[
          question.answersFormat === 'fix' && {
            type: 'radio',
            name: 'fixAnswerId',
            label: 'Choose one answer',
            choices: question.fixAnswers.map((choice) => ({
              value: choice.id,
              label: choice.text,
            })),
          },
          question.answersFormat === 'free' && {
            type: 'textarea',
            name: 'freeAnswer',
            label: 'Type your Answer',
          },
        ]}
      />
    </>
  );
}
