import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionDetails from '../../../../../components/question/details';
import QuestionUpdate from '../../../../../components/question/update';
import RoomPage from '../../../../../components/room/page';
// todo, guard QuestionUpdate import { Can } from '../../../../../components/utils/casl-context';
// import { subject } from '@casl/ability';
import Drawer from '../../../../../components/utils/container/drawer';
import Fetch from '../../../../../components/utils/container/fetch';
import { Answer } from '../../../../../types/answer';
import { Question } from '../../../../../types/question';

export default function QuestionIndex(): ReactElement {
  const { id, questionId } = useRouter().query;

  return (
    <Fetch<Question> url={`api/rooms/${id}/questions/${questionId}`}>
      {(question) => (
        <Fetch<Answer[]>
          url={`api/rooms/${id}/questions/${questionId}/answers`}
        >
          {(answers) => (
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
                  subject="Room"
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
              <QuestionDetails
                question={question}
                answers={answers}
                roomId={Number(id)}
              />
            </RoomPage>
          )}
        </Fetch>
      )}
    </Fetch>
  );
}
