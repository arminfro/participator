import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionList from '../../../../components/question/list';
import RoomPage from '../../../../components/room/page';
import Fetch from '../../../../components/utils/fetch';
import { Room } from '../../../../types/room';

export default function QuestionIndex(): ReactElement {
  const router = useRouter();
  return (
    <Fetch<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => (
        <RoomPage
          room={room}
          path={[{ name: 'Questions', url: `/rooms/${room.id}/questions` }]}
        >
          <QuestionList questions={room.questions} />
        </RoomPage>
      )}
    </Fetch>
  );
}
