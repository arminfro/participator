import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionDetails from '../../../../../components/question/details';
import QuestionUpdate from '../../../../../components/question/update';
import RoomPage from '../../../../../components/room/page';
// todo, guard QuestionUpdate import { Can } from '../../../../../components/utils/casl-context';
// import { subject } from '@casl/ability';
import Drawer from '../../../../../components/utils/container/drawer';
import FetchDynamicImport from '../../../../../components/utils/container/fetch-dynamic-import';
import { Question } from '../../../../../types/question';

export default function QuestionIndex(): ReactElement {
  const { id, questionId } = useRouter().query;

  return (
    <FetchDynamicImport<Question>
      url={`api/rooms/${id}/questions/${questionId}`}
    >
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
            <Drawer
              key={'question-update'}
              contentWrapperStyle={{ width: 512 }}
              action="Edit"
              subject="Question"
            >
              {(onClose: () => void) => (
                <QuestionUpdate
                  onCloseDrawer={onClose}
                  roomId={Number(id)}
                  question={question}
                />
              )}
            </Drawer>,
          ]}
        >
          <QuestionDetails question={question} roomId={Number(id)} />
        </RoomPage>
      )}
    </FetchDynamicImport>
  );
}
