import { useState } from 'react';
import { Answer, AnswerCreate } from '../../../types/answer';
import { validateAnswerCreate } from '../../../types/answer.validation';
import api from '../funcs/api';
import { SetCallback, useStruct, UseStruct } from './use-struct';

// export function useAnswerUpdate(
//   roomId: number,
//   questionId: number,
//   answerId: number,
//   answer: Answer,
//   autoValidate = false,
//   autoSync = false,
// ): UseStruct<AnswerUpdate> {
//   const states = {
//     freeAnswer: useState(answer.freeAnswer),
//     fixAnswerId: useState(answer.fixAnswer.id),
//   };

//   return useStruct<AnswerUpdate>({
//     states,
//     validator: (answer: Answer) => validateAnswerUpdate(answer),
//     remoteUpdate: (newAnswer: Answer) =>
//       api(
//         'patch',
//         `api/rooms/${roomId}/questions/${questionId}/answers/${answerId}`,
//         newAnswer,
//       ).then((data) => {
//         if (data) return data;
//       }),
//     autoSync,
//     autoValidate,
//   });
// }

export function useAnswerCreate(
  roomId: number,
  questionId: number,
  autoValidate = false,
  autoSync = false,
): UseStruct<AnswerCreate> {
  const states = {
    freeAnswer: useState(''),
    fixAnswerId: useState<number>(),
  };

  return useStruct<AnswerCreate>({
    states,
    autoValidate,
    validator: (answer) => validateAnswerCreate(answer),
    autoSync,
    remoteUpdate: (newAnswer: Answer) =>
      api<AnswerCreate>(
        'post',
        `api/rooms/${roomId}/questions/${questionId}/answers`,
        newAnswer,
      ).then((data) => {
        if (data) return data;
      }),
  });
}
