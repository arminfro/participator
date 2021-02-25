import React from 'react';
import Answer from '../../../../../../types/answer';

interface Props {
  answers: Answer[];
  rangeOrFix?: boolean; //range = true; fix = false --> rangeOrFix is defined in Interface QuestionCreate so it can probably be deleted here?! But how can we push it in Answer[]?
}

export default function FixAnswersResults(props: Props) {
  // qtodo, answerType with value true or false is not very descriptive
  // and there is no usage of return value, can be deleted?!
  const answerType = () => {
    if (typeof props.answers[0].fixAnswer === 'string') {
      return props.rangeOrFix === false;
    } else {
      return props.rangeOrFix === true;
    }
  };
  answerType();

  const votes = [];

  const reduceAnswers = props.answers.reduce(function (acc, answer) {
    let value: string | number;
    // qtodo, in both cases we take answer.fixAnswer, is not needed?!
    if (!props.rangeOrFix) {
      value = answer.fixAnswer;
    } else {
      value = answer.fixAnswer;
    }

    if (acc[value]) {
      acc[value] = acc[value] + 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, {});

  // qtodo, it's used only once, doesn't need to be a variable
  const reducedAnswersEntries = Object.entries(reduceAnswers);

  const arrayOfVotes = () => {
    reducedAnswersEntries.map((keyValuePair) => {
      votes.push(keyValuePair[1]);
    });
  };

  // qtodo, we don't use return value, can be deleted?!
  arrayOfVotes();

  const numberOfVotes = votes.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
  );

  return (
    <div>
      <div>Total amount of answers: {numberOfVotes} </div>
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
                  {((reduceAnswers[choice] / numberOfVotes) * 100).toFixed(2)} %
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
