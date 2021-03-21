import React from 'react';

import Answer from '../../types/answer';

interface Props {
  answers: Answer[];
}

export default function FixAnswersResults(props: Props) {
  const votes = [];
  const allAnswers = props.answers[0].question.fixAnswers.map(
    (fixAnswer) => fixAnswer.answer,
  );

  const reduceAnswers = props.answers.reduce(function (acc, answer) {
    const value = answer.fixAnswer;
    if (acc[value]) {
      acc[value] = acc[value] + 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, {});

  const numberOfVotes = votes.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
  );

  return (
    <div>
      <div>Total amount of answers: {numberOfVotes} </div>
      <table className="ui table">
        <tbody>
          {allAnswers.map((choice) => {
            const percentage = (
              (reduceAnswers[choice] / numberOfVotes) *
              100
            ).toFixed(2);
            return (
              <tr key={choice}>
                <td>
                  <span>{choice}</span>
                  <br />
                  <span>{reduceAnswers[choice]}</span>
                  <span style={{ textAlign: 'right' }}>
                    {reduceAnswers[choice] !== undefined ? (
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
