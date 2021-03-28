import React from 'react';

import { Answer } from '../../types/answer';
import { Question } from '../../types/question';

interface Props {
  question: Question;
  answers: Answer[];
}

export default function ListFixAnswers({ question, answers }: Props) {
  const givenAnswers = question.fixAnswers.map((fixAnswer) => fixAnswer.text);

  const givenAnswersCountMap = answers.reduce(function (acc, answer) {
    console.log('question', question, 'answer', answer);
    const value = answer.fixAnswer.text;
    acc[value] = acc[value] ? acc[value] + 1 : 1;
    return acc;
  }, {});

  const voteCount = answers.length;

  return (
    <div>
      <div>Total amount of answers: {voteCount} </div>
      <table className="ui table">
        <tbody>
          <tr>
            <th>Answer</th>
          </tr>
          {givenAnswers.map((choice) => {
            const percentage = (
              (givenAnswersCountMap[choice] / voteCount) *
              100
            ).toFixed(2);
            return (
              <tr key={choice}>
                <td style={{ width: 200 }}>{choice}</td>
                <td>
                  <span>{givenAnswersCountMap[choice]}</span>
                  <span style={{ textAlign: 'right' }}>
                    {givenAnswersCountMap[choice] !== undefined ? (
                      <div
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: 'blue',
                        }}
                      >
                        {percentage}%
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '20px',
                          textAlign: 'left',
                          backgroundColor: 'orange',
                        }}
                      >
                        0%
                      </div>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div />
    </div>
  );
}
