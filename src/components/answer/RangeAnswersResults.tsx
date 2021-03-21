import React from 'react';

import Answer from '../../types/answer';

interface Props {
  answers: Answer[];
}

export default function RangeAnswersResults(props: Props) {
  const reducedAnswers = props.answers.reduce(function (acc, answer) {
    const value = answer.rangeAnswer;
    if (acc[value]) {
      acc[value] = acc[value] + 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, {});

  const voteCount = props.answers.length;

  return (
    <div>
      <div>Total amount of answers: {voteCount} </div>
      <table className="ui table">
        <tbody>
          <tr>
            <th>Answers</th>
            <th>Total votes</th>
            <th>Relative votes</th>
          </tr>
          {Object.keys(reducedAnswers).map((choice) => {
            return (
              <tr key={choice}>
                <td>{choice}</td>
                <td>{reducedAnswers[choice]}</td>
                <td>
                  {((reducedAnswers[choice] / voteCount) * 100).toFixed(2)} %
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
