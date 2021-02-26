import React from 'react';
import Answer from '../../../../../../types/answer';

interface Props {
  answers: Answer[];
  rangeOrFix: boolean; //range = true; fix = false --> rangeOrFix is defined in Interface QuestionCreate so it can probably be deleted here?! But how can we push it in Answer[]?
}

export default function FixAnswersResults(props: Props) {

  const answerType = () => {
    if (typeof props.answers[0].fixAnswer === 'string') {
      return props.rangeOrFix === false;
    } else {
      return props.rangeOrFix === true;
    }
  };
  answerType();

  console.log(props.answers);
  const votes = [];
  const allAnswers = [];
  const showAllAnswers = () => {
    JSON.parse(props.answers[0].question.fixAnswers).map((answerText: string) =>
      allAnswers.push(answerText),
      console.log(allAnswers)
    );
  };
  showAllAnswers();

  const reduceAnswers = props.answers.reduce(function (acc, answer) {
    /*  let value: string | number;
     if (!props.rangeOrFix) {
       value = answer.fixAnswer;
     } else {
       value = answer.fixAnswer;
     } */
    const value = answer.fixAnswer;
    console.log(value);
    if (acc[value]) {
      acc[value] = acc[value] + 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  },
    {}, // was ins Objekt eingefügt wird (z.B. Array) landet im Objekt in den Values.
  );

  console.log(reduceAnswers);

  const reducedAnswersEntries = Object.entries(reduceAnswers);
  console.log(reducedAnswersEntries);

  const arrayOfVotes = () => {
    reducedAnswersEntries.map((keyValuePair) => {
      votes.push(keyValuePair[1]);
    });
  };

  arrayOfVotes();

  const numberOfVotes = votes.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
  );

  return (
    <div>
      <div>Total amount of answers: {numberOfVotes} </div>
      <table className="ui table">
        <tbody>
          {allAnswers.map((choice) => {
            const percentage = ((reduceAnswers[choice] / numberOfVotes) * 100).toFixed(2);
            return (
              <tr key={choice}>
                <td>
                  <span>{choice}</span>
                  <br />
                  <span>{reduceAnswers[choice]}</span>
                  <span style={{ textAlign: 'right' }}>
                    {reduceAnswers[choice] !== undefined
                      ? <div style={{ width: `${percentage}%`, backgroundColor: 'blue' }}>{percentage}%</div>
                      : <div style={{ width: '20px', textAlign: 'left', backgroundColor: 'orange' }}>0%</div>}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div />
    </div >
  );
}
