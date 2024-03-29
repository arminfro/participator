import { Comment, Timeline } from 'antd';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../types/question';
import UserAvatar from '../utils/container/user-avatar';

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props): ReactElement {
  const router = useRouter();
  const roomId = router.query.id;

  return (
    <Timeline>
      {questions.reverse().map((question) => {
        return (
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
              avatar={<UserAvatar user={question.user} />}
              content={
                <Link
                  href="/rooms/[id]/questions/[questionId]"
                  as={`/rooms/${roomId}/questions/${question.id}`}
                >
                  {question.text}
                </Link>
              }
            />
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
