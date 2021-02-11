import React from 'react';
import Answer from '../../../../../../types/answer';

interface Props {
  answers: Answer[];
}
export default function FixAnswersResults(props: Props) {
  const votes = [];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const reduceAnswers = props.answers.reduce(function (acc, answer) {
    const value = answer.fixAnswer;
    if (acc[value]) {
      acc[value] = acc[value] + 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, {});

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
