import React from 'react';

import Answer from '../../types/answer';

interface Props {
  answers: Answer[];
}

export default function FreeAnswersResults(props: Props) {
  return (
    <div>
      {props.answers.map((answerObject) => {
        return (
          <div key={answerObject.id}>
            <h5>
              Antwort von {answerObject.user.name},{' '}
              {`${new Date(
                answerObject.createdAt,
              ).toLocaleTimeString()}, ${new Date(
                answerObject.createdAt,
              ).toLocaleTimeString()}`}
            </h5>
            <p>{answerObject.freeAnswer}</p>
            <br />
          </div>
        );
      })}
    </div>
  );
}