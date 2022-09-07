import React from 'react';
import { Comment } from 'antd';
import { formatDistance } from 'date-fns';
import UserAvatar from '../utils/container/user-avatar';
// import { Column } from '@ant-design/charts';

import { Answer } from '../../types/answer';
import { Question } from '../../types/question';
// import sort from '../utils/funcs/sort';

interface Props {
  question: Question;
  answers: Answer[];
}

// interface ReducedFixAnswer {
//   answer: string;
//   count: any;
// }

export default function ListFixAnswers(props: Props) {
  // const givenAnswersCountMap = props.answers.reduce(function(acc, answer) {
  //   const value = answer.fixAnswer.text;
  //   acc[value] = acc[value] ? acc[value] + 1 : 1;
  //   return acc;
  // }, {});

  // const givenAnswers = sort<ReducedFixAnswer>(
  //   props.question.fixAnswers.map((fixAnswer) => ({
  //     answer: fixAnswer.text,
  //     count: givenAnswersCountMap[fixAnswer.text],
  //   })),
  //   'answer',
  // );

  const voteCount = props.answers.length;

  return (
    <div>
      <div>Total amount of answers: {voteCount} </div>
      <p>
        <a href="https://github.com/ant-design/ant-design-charts/issues/1275">
          Open Issue
        </a>{' '}
        needs to be resolved to display implemented Charts
      </p>
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
          content={<p>{answerObject.fixAnswer.text}</p>}
        />
      ))}
      {/* <Column */}
      {/*   data={givenAnswers} */}
      {/*   xField={'answer'} */}
      {/*   yField={'count'} */}
      {/*   label={{ position: 'middle' }} */}
      {/* /> */}
    </div>
  );
}
