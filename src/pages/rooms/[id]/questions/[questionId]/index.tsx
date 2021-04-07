import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../../../../types/question';
import QuestionDetails from '../../../../../components/question/details';
import Fetch from '../../../../../components/utils/fetch';
import RoomPage from '../../../../../components/room/page';
import { Button } from 'antd';
import Link from 'next/link';

export default function QuestionIndex(): ReactElement {
  const { id, questionId } = useRouter().query;

  return (
    <Fetch<Question> url={`api/rooms/${id}/questions/${questionId}`}>
      {(question) => (
        <RoomPage
          room={question.room}
          path={[
            { name: 'Questions', url: `/rooms/${id}/questions` },
            {
              name: question.text,
              url: `/rooms/${id}/questions/${question.id}`,
            },
          ]}
          extra={[
            <Button key="question-edit">
              <Link
                href="/rooms/[id]/questions/[id]/edit"
                as={`/rooms/${id}/questions/${question.id}/edit`}
              >
                Edit
              </Link>
            </Button>,
          ]}
        >
          <QuestionDetails question={question} roomId={Number(id)} />
        </RoomPage>
      )}
    </Fetch>
  );
}
