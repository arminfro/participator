import { useState } from 'react';
import { User, UserUpdate } from '../../../../types/user';
import { validateUserUpdate } from '../../../../types/user.validation';
import api from '../../../utils/api';
import { SetCallback, useStruct, UseStructWithValidation } from './use-struct';

export function useUserUpdate(
  userId: number,
  user: UserUpdate,
  withValidation = false,
  autoSync = false,
): UseStructWithValidation<UserUpdate> {
  const name = useState(user.name);
  const hasHandUp = useState(user.hasHandUp);
  const randomGroup = useState(user.randomGroup);
  const active = useState(user.active);

  return useStruct<UserUpdate>(
    {
      name,
      hasHandUp,
      randomGroup,
      active,
    },
    withValidation && ((user) => validateUserUpdate(user)),
    autoSync &&
      ((callback: SetCallback<UserUpdate>, newUser: User) =>
        api<UserUpdate>('PATCH', `api/users/${userId}`, callback, newUser)),
  );
}

// todo, nested objects break the code
// export function useUserCreate(user: UserCreate, withValidation = false) {
//   const name = useState(user.name);
//   const pw1 = useState(user.pws.pw1);
//   const pw2 = useState(user.pws.pw2);
//   return useStruct<{ name: string; pw1: string; pw2: string }>(
//     { name, pw1, pw2 },
//     withValidation &&
//       ((user) =>
//         validateUserCreate({
//           name: user.name,
//           pws: { pw1: user.pw1, pw2: user.pw2 },
//         })),
//     false,
//   );
// }