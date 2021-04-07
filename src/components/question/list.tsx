import { Button, Timeline } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../types/question';

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props): ReactElement {
  const router = useRouter();
  const roomId = router.query.id;

  return (
    <Timeline>
      {questions.map((question) => (
        <Timeline.Item key={question.id}>
          <Link
            href="/rooms/[id]/questions/[id]"
            as={`/rooms/${roomId}/questions/${question.id}`}
          >
            {question.text}
          </Link>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
