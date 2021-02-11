// wie stelle ich die Zahlen von 1 - 10 als default da?

import React from 'react';
import Answer from '../../../../../../types/answer';
// import AnswerCreate from '../../../../../../types/answer';

interface Props {
  answers: Answer[];
}

export default function RangeAnswersResults(props: Props) {
  const votes = [];
  const reducer = (accumulator: number, currentValue: number) =>
    accumulator + currentValue;
  const reduceAnswers = props.answers.reduce(function (acc, answer) {
    const value = answer.rangeAnswer;
    if (acc[value]) {
      acc[value] = acc[value] + 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, []);
  console.log(reduceAnswers);

  const reducedAnswersEntries = Object.entries(reduceAnswers);
  const arrayOfVotes = () => {
    reducedAnswersEntries.map((keyValuePair) => {
      votes.push(keyValuePair[1]);
      return votes;
    });
  };
  arrayOfVotes();
  const allVotes = votes.reduce(reducer);

  return (
    <div>
      <div>Total amount of answers: {allVotes} </div>
      <table className="ui table">
        <tbody>
          <tr>
            <th>Answers</th>
            <th>Total votes</th>
            <th>Relative votes</th>
          </tr>
          {Object.keys(reduceAnswers).map((choice) => {
            return (
              <tr key={choice}>
                <td>{choice}</td>
                <td>{reduceAnswers[choice]}</td>
                <td>
                  {((reduceAnswers[choice] / allVotes) * 100).toFixed(2)} %
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}
