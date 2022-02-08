import { pick } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { Room, RoomCreate, RoomUpdate } from '../../../types/room';
import {
  validateRoomCreate,
  validateRoomUpdate,
} from '../../../types/room.validation';
import api from '../funcs/api';
import { UseStruct, useStruct } from './use-struct';

export function useRoomUpdate(
  roomId: number,
  room: Room,
  autoSync = false,
): UseStruct<RoomUpdate> {
  return useStruct<RoomUpdate>({
    states: {
      name: useState(room.name),
      description: useState(room.description),
      openToJoin: useState(room.openToJoin),
    },
    validator: useCallback(validateRoomUpdate, []),
    remoteUpdate: (newRoom: Room) =>
      api('patch', `api/rooms/${roomId}`, newRoom).then((data) => {
        if (data) return data;
      }),
    isEdit: true,
    initialValues: pick(room, 'name', 'description', 'openToJoin'),
    autoSync,
  });
}

export function useRoomCreate(autoSync = false): UseStruct<RoomCreate> {
  const initialValues: RoomCreate = {
    name: '',
    description: '',
    openToJoin: true,
  };

  return useStruct<RoomCreate>({
    states: {
      name: useState(initialValues.name),
      description: useState(initialValues.description),
      openToJoin: useState(initialValues.openToJoin),
    },
    initialValues,
    validator: useCallback((room) => validateRoomCreate(room), []),
    autoSync,
    remoteUpdate: useCallback(
      (newRoom: Room) =>
        api<RoomCreate>('post', `api/rooms`, newRoom).then((data) => {
          if (data) return data;
        }),
      [],
    ),
  });
}
