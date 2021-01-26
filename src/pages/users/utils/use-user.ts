import { useState, Dispatch, SetStateAction } from 'react';
import Room from '../../../types/room';

import User, { validateUserEdit, ValidationErrors } from '../../../types/user';
import api from '../../utils/api';

type UseUserSetterCallback = (data: User) => void;

interface UseUser {
  get: {
    id: number;
    name: string;
    hasHandUp: boolean;
    randomGroup: boolean;
    active: boolean;
    groupId: number | undefined;
    joinedRooms: Room[];
    ownedRooms: Room[];
    getUser: () => User;
    validationErrors: ValidationErrors;
  };
  set: {
    name: (
      newName: string,
      sync: boolean,
      callback?: UseUserSetterCallback,
    ) => User;
    hasHandUp: (
      newHasHandUp: boolean,
      sync: boolean,
      callback?: UseUserSetterCallback,
    ) => User;
    randomGroup: (
      newRandomGroup: boolean,
      sync: boolean,
      callback?: UseUserSetterCallback,
    ) => User;
    active: (
      newActive: boolean,
      sync: boolean,
      callback?: UseUserSetterCallback,
    ) => User;
  };
}

export default function useUser(user: User, withValidation = false): UseUser {
  const [name, setName] = useState(user.name);
  const [hasHandUp, setHasHandUp] = useState(user.hasHandUp);
  const [randomGroup, setRandomGroup] = useState(user.randomGroup);
  const [active, setActive] = useState(user.active);
  const [joinedRooms] = useState(user.joinedRooms);
  const [ownedRooms] = useState(user.ownedRooms);
  const [groupId] = useState(user.groupId);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const getUser = (): User => {
    return {
      id: user.id,
      name,
      hasHandUp,
      randomGroup,
      active,
      groupId,
      joinedRooms,
      ownedRooms,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildNewUser = (attr: string, value: any): User => {
    return { ...getUser(), [attr]: value };
  };

  const remoteUpdate = (newUser: User, callback: UseUserSetterCallback) => {
    api<User>('PATCH', `api/users/${newUser.id}`, callback, newUser);
  };

  const genericSetter = (
    attr: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue: any,
    sync: boolean,
    setter: Dispatch<SetStateAction<any>>,
    callback: UseUserSetterCallback,
  ): User => {
    const newUser = buildNewUser(attr, newValue);
    const errors: ValidationErrors = validateUserEdit(getUser(), newUser);

    if (errors.length === 0) {
      setter(newValue);
      sync && remoteUpdate(newUser, callback);
      return newUser;
    } else {
      console.error(errors);
      setValidationErrors(errors);
      if (withValidation) {
        return user;
      } else {
        setter(newValue);
        return newUser;
      }
    }
  };

  return {
    get: {
      id: user.id,
      name,
      hasHandUp,
      randomGroup,
      active,
      groupId,
      ownedRooms,
      joinedRooms,
      getUser: getUser,
      validationErrors,
    },
    set: {
      name: (
        newName,
        sync,
        callback = (): void => {
          /* no-op */
        },
      ) => {
        return genericSetter('name', newName, sync, setName, callback);
      },
      hasHandUp: (
        newHasHandUp,
        sync,
        callback = (): void => {
          /* no-op */
        },
      ) => {
        console.log('setter', sync);
        return genericSetter(
          'hasHandUp',
          newHasHandUp,
          sync,
          setHasHandUp,
          callback,
        );
      },
      randomGroup: (
        newRandomGroup,
        sync,
        callback = (): void => {
          /* no-op */
        },
      ) => {
        return genericSetter(
          'randomGroup',
          newRandomGroup,
          sync,
          setRandomGroup,
          callback,
        );
      },
      active: (
        newActive,
        sync,
        callback = (): void => {
          /* no-op */
        },
      ) => {
        return genericSetter('active', newActive, sync, setActive, callback);
      },
    },
  };
}
