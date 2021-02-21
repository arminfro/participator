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
