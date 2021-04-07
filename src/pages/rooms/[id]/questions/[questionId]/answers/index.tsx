import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Answer } from '../../../../../../types/answer';
import Fetch from '../../../../../../components/utils/fetch';
import AnswerList from '../../../../../../components/answer/list';
import RoomPage from '../../../../../../components/room/page';
import { Question } from '../../../../../../types/question';

export default function AnswerIndex(): ReactElement {
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
              <AnswerList question={question} answers={answers} />
            </RoomPage>
          )}
        </Fetch>
      )}
    </Fetch>
  );
}
