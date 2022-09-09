import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionCreate from '../../../../components/question/create';
import QuestionList from '../../../../components/question/list';
import RoomPage from '../../../../components/room/page';
import Drawer from '../../../../components/utils/container/drawer';
import FetchDynamicImport from '../../../../components/utils/container/fetch-dynamic-import';
import { Question } from '../../../../types/question';
import { Room } from '../../../../types/room';

export default function QuestionIndex(): ReactElement {
  const roomId = useRouter().query.id;

  return (
    <FetchDynamicImport<Room> url={`api/rooms/${roomId}`}>
      {(room) => (
        <FetchDynamicImport<Question[]> url={`api/rooms/${roomId}/questions`}>
          {(questions) => (
            <RoomPage
              room={room}
              path={[{ name: 'Questions', url: `/rooms/${roomId}/questions` }]}
              extra={[
                <Drawer
                  key="new-room"
                  primaryButton
                  action="Create"
                  subject="Question"
                >
                  {(onClose: () => void) => (
                    <QuestionCreate roomId={room.id} onCloseDrawer={onClose} />
                  )}
                </Drawer>,
              ]}
            >
              <QuestionList questions={questions} />
            </RoomPage>
          )}
        </FetchDynamicImport>
      )}
    </FetchDynamicImport>
  );
}
