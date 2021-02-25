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
  }, {});

  const reducedAnswersEntries = Object.entries(reduceAnswers);

  // qtodo, we don't need to wrap a statemant in a function and call
  // the function on the next line, we could just do `const arrayOfVotes = reducedAnswersEntries.map(...)`
  // qtodo, we don't need a sideeffect here, in the case of a sideeffect we could just call `forEach` instead of `map`
  // I suggest we stay with map and remove the line with `const votes = []`, then we could call map and assign
  // the return value to votes, like  `const votes = reducedAnswersEntries.map(...)` will lead to the same result
  const arrayOfVotes = () => {
    reducedAnswersEntries.map((keyValuePair) => {
      votes.push(keyValuePair[1]);
      return votes;
    });
  };
  arrayOfVotes();
  // qtodo, reducer is used only once, no need to put it in a variable, just define it inline
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
