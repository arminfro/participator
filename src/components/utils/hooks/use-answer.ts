import { useState } from 'react';
import { Answer, AnswerCreate } from '../../../types/answer';
import { validateAnswerCreate } from '../../../types/answer.validation';
import api from '../funcs/api';
import { useStruct, UseStruct } from './use-struct';

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
//     isEdit: true,
//     autoValidate,
//   });
// }

export function useAnswerCreate(
  roomId: number,
  questionId: number,
  autoSync = false,
): UseStruct<AnswerCreate> {
  const initialValues: AnswerCreate = {
    freeAnswer: '',
    fixAnswerId: undefined,
  };
  const states = {
    freeAnswer: useState(initialValues.freeAnswer),
    fixAnswerId: useState<number>(initialValues.fixAnswerId),
  };

  return useStruct<AnswerCreate>({
    states,
    validator: (answer) => validateAnswerCreate(answer),
    initialValues,
    autoSync,
    afterRemoteUpdate: (answer: any) => {
      return answer.question;
    },
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
