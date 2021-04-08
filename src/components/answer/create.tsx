import { Button, Form } from 'antd';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
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

  const onSubmit = () => {
    if (answer.get.fixAnswerId || answer.get.freeAnswer) {
      answer.sync(() => {
        router.push(`/rooms/${roomId}/questions/${question.id}/answers`);
      });
    }
  };

  return (
    <Form initialValues={answer.get} onFinish={onSubmit}>
      {question.answersFormat === 'fix' && (
        <FixAnswer
          setFixAnswerId={(id) => answer.set.fixAnswerId(id)}
          fixAnswers={question.fixAnswers}
          chosenAnswerId={answer.get.fixAnswerId}
        />
      )}
      {question.answersFormat === 'free' && (
        <FreeAnswer setFreeAnswer={(text) => answer.set.freeAnswer(text)} />
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
