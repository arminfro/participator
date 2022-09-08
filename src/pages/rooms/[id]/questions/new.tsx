import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionCreate from '../../../../components/question/create';
import RoomPage from '../../../../components/room/page';
import FetchDynamicImport from '../../../../components/utils/container/fetch-dynamic-import';
import { Room } from '../../../../types/room';

export default function QuestionNew(): ReactElement {
  const router = useRouter();
  const { id } = router.query;

  return (
    <FetchDynamicImport<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => (
        <RoomPage
          room={room}
          path={[
            { name: 'Questions', url: `/rooms/${room.id}/questions` },
            { name: 'Create Poll', url: `/rooms/${room.id}/questions/new` },
          ]}
        >
          {/* todo1 */}
          <QuestionCreate roomId={Number(id)} />
        </RoomPage>
      )}
    </FetchDynamicImport>
  );
}
