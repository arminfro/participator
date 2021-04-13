import { Avatar, Comment, Timeline } from 'antd';
import { formatDistance } from 'date-fns';
import * as Faker from 'faker';
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
      {questions.reverse().map((question) => (
        <Timeline.Item key={question.id}>
          <Comment
            key={question.id}
            datetime={
              <>
                {formatDistance(question.createdAt, new Date(), {
                  includeSeconds: true,
                })}
                {' ago'}
              </>
            }
            avatar={
              <Avatar src={Faker.image.avatar()} alt={question.user.name} />
            }
            content={
              <Link
                href="/rooms/[id]/questions/[id]"
                as={`/rooms/${roomId}/questions/${question.id}`}
              >
                {question.text}
              </Link>
            }
          />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
