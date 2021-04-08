import React from 'react';
import { Column } from '@ant-design/charts';

import { Answer } from '../../types/answer';
import { Question } from '../../types/question';
import sort from '../utils/funcs/sort';

interface Props {
  question: Question;
  answers: Answer[];
}

interface ReducedFixAnswer {
  answer: string;
  count: any;
}

export default function FixAnswersResults(props: Props) {
  const givenAnswersCountMap = props.answers.reduce(function (acc, answer) {
    const value = answer.fixAnswer.text;
    acc[value] = acc[value] ? acc[value] + 1 : 1;
    return acc;
  }, {});

  const givenAnswers = sort<ReducedFixAnswer>(
    props.question.fixAnswers.map((fixAnswer) => ({
      answer: fixAnswer.text,
      count: givenAnswersCountMap[fixAnswer.text],
    })),
    'answer',
  );

  const voteCount = props.answers.length;

  return (
    <div>
      <div>Total amount of answers: {voteCount} </div>
      <Column
        data={givenAnswers}
        xField={'answer'}
        yField={'count'}
        label={{ position: 'middle' }}
      />
    </div>
  );
}
