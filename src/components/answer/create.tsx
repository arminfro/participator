import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { AnswerCreate as IAnswerCreate } from '../../types/answer';
import { Question } from '../../types/question';
import Form from '../utils/container/form/form';
import FormRadioGroupItem from '../utils/container/form/radio-group-item';
import FormTextareaItem from '../utils/container/form/textarea-item';
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

  const onSubmit = (promise: Promise<IAnswerCreate>) =>
    promise.then(() => {
      if (answer.get.fixAnswerId || answer.get.freeAnswer) {
        router.push(`/rooms/${roomId}/questions/${question.id}`);
      }
    });

  return (
    <>
      <Form<IAnswerCreate> onSubmit={onSubmit} struct={answer}>
        {question.answersFormat === 'fix' && (
          <FormRadioGroupItem
            label="Choose on answer"
            name="fixAnswerId"
            choices={question.fixAnswers.map((choice) => ({
              value: choice.id,
              label: choice.text,
            }))}
          />
        )}
        {question.answersFormat === 'free' && (
          <FormTextareaItem label="Type your answer" name="freeAnswer" />
        )}
      </Form>
    </>
  );
}
