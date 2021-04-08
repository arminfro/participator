import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionList from '../../../../components/question/list';
import RoomPage from '../../../../components/room/page';
import Fetch from '../../../../components/utils/container/fetch';
import { Question } from '../../../../types/question';
import { Room } from '../../../../types/room';

export default function QuestionIndex(): ReactElement {
  const roomId = useRouter().query.id;

  return (
    <Fetch<Room> url={`api/rooms/${roomId}`}>
      {(room) => (
        <Fetch<Question[]> url={`api/rooms/${roomId}/questions`}>
          {(questions) => (
            <RoomPage
              room={room}
              path={[{ name: 'Questions', url: `/rooms/${roomId}/questions` }]}
              extra={[
                <Button key="create-poll" type="primary">
                  <Link
                    href="/rooms/[id]/questions/new"
                    as={`/rooms/${roomId}/questions/new`}
                  >
                    Create poll
                  </Link>
                </Button>,
              ]}
            >
              <QuestionList questions={questions} />
            </RoomPage>
          )}
        </Fetch>
      )}
    </Fetch>
  );
}
