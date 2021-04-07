import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Question } from '../../../../../types/question';
import QuestionUpdate from '../../../../../components/question/update';
import Fetch from '../../../../../components/utils/fetch';
import RoomPage from '../../../../../components/room/page';

export default function QuestionEdit(): ReactElement {
  const { id, questionId } = useRouter().query;

  return (
    <Fetch<Question> url={`api/rooms/${id}/questions/${questionId}`}>
      {(question) => (
        <RoomPage
          room={question.room}
          path={[
            { name: 'Questions', url: `/rooms/${question.room.id}/questions` },
            {
              name: question.text,
              url: `/rooms/${question.room.id}/questions/${question.id}`,
            },
            {
              name: 'Edit Poll',
              url: `/rooms/${question.room.id}/questions/${question.id}/edit`,
            },
          ]}
        >
          <QuestionUpdate question={question} roomId={Number(id)} />
        </RoomPage>
      )}
    </Fetch>
  );
}
