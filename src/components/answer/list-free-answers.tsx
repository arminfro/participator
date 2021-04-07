import { Avatar, Comment } from 'antd';
import * as Faker from 'faker';
import { formatDistance } from 'date-fns';
import React from 'react';

import { Answer } from '../../types/answer';

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
          avatar={
            <Avatar src={Faker.image.avatar()} alt={answerObject.user.name} />
          }
          content={<p>{answerObject.freeAnswer}</p>}
        />
      ))}
    </div>
  );
}
