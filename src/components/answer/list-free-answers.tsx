import { Comment } from 'antd';
import { formatDistance } from 'date-fns';
import React from 'react';
import { Answer } from '../../types/answer';
import UserAvatar from '../utils/container/user-avatar';

interface Props {
  answers: Answer[];
}

export default function ListFreeAnswers(props: Props) {
  return (
    <div>
      {props.answers.map((answerObject) => (
        <Comment
          key={answerObject.id}
          datetime={
            <>
              {formatDistance(answerObject.createdAt, new Date(), {
                includeSeconds: true,
              })}
              {' ago'}
            </>
          }
          avatar={<UserAvatar user={answerObject.user} />}
          content={<p>{answerObject.freeAnswer}</p>}
        />
      ))}
    </div>
  );
}
