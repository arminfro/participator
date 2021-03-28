import { useState } from 'react';
import { Answer, AnswerCreate } from '../../../types/answer';
import { validateAnswerCreate } from '../../../types/answer.validation';
import api from '../api';
import { SetCallback, useStruct, UseStructWithValidation } from './use-struct';

// export function useAnswerUpdate(
//   roomId: number,
//   questionId: number,
//   answerId: number,
//   answer: Answer,
//   autoValidate = false,
//   autoSync = false,
// ): UseStructWithValidation<AnswerUpdate> {
//   const states = {
//     freeAnswer: useState(answer.freeAnswer),
//     fixAnswerId: useState(answer.fixAnswer.id),
//   };

//   return useStruct<AnswerUpdate>({
//     states,
//     validator: (answer: Answer) => validateAnswerUpdate(answer),
//     update: (callback: SetCallback<AnswerUpdate>, newAnswer: Answer) =>
//       api(
//         'patch',
//         `api/rooms/${roomId}/questions/${questionId}/answers/${answerId}`,
//         callback,
//         newAnswer,
//       ),
//     autoSync,
//     autoValidate,
//   });
// }

export function useAnswerCreate(
  roomId: number,
  questionId: number,
  autoValidate = false,
  autoSync = false,
): UseStructWithValidation<AnswerCreate> {
  const states = {
    freeAnswer: useState(''),
    fixAnswerId: useState<number>(),
  };

  return useStruct<AnswerCreate>({
    states,
    autoValidate,
    validator: (answer) => validateAnswerCreate(answer),
    autoSync,
    update: (callback: SetCallback<AnswerCreate>, newAnswer: Answer) =>
      api<AnswerCreate>(
        'post',
        `api/rooms/${roomId}/questions/${questionId}/answers`,
        callback,
        newAnswer,
      ),
  });
}
