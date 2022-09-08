import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Answer } from '../../../../../../types/answer';
import QuestionDetails from '../../../../../../components/question/details';
import RoomPage from '../../../../../../components/room/page';
import { Question } from '../../../../../../types/question';
import FetchDynamicImport from '../../../../../../components/utils/container/fetch-dynamic-import';

export default function AnswerIndex(): ReactElement {
  const { id, questionId } = useRouter().query;

  return (
    <FetchDynamicImport<Question>
      url={`api/rooms/${id}/questions/${questionId}`}
    >
      {(question) => (
        <FetchDynamicImport<Answer[]>
          url={`api/rooms/${id}/questions/${questionId}/answers`}
        >
          {(answers) => (
            <RoomPage
              room={question.room}
              path={[
                {
                  name: 'Questions',
                  url: `/rooms/${question.room.id}/questions`,
                },
                {
                  name: question.text,
                  url: `/rooms/${question.room.id}/questions/${question.id}`,
                },
                {
                  name: 'Answers',
                  url: `/rooms/${question.room.id}/questions/${question.id}/answers`,
                },
              ]}
            >
              {/* todo1 */}
              <QuestionDetails question={question} roomId={Number(id)} />
            </RoomPage>
          )}
        </FetchDynamicImport>
      )}
    </FetchDynamicImport>
  );
}
