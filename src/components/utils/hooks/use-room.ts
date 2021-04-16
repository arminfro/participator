import { useCallback, useState } from 'react';
import { Room, RoomCreate, RoomUpdate } from '../../../types/room';
import {
  validateRoomCreate,
  validateRoomUpdate,
} from '../../../types/room.validation';
import api from '../funcs/api';
import { UseStruct, SetCallback, useStruct } from './use-struct';

export function useRoomUpdate(
  roomId: number,
  room: Room,
  autoValidate = false,
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

    autoSync,
    autoValidate,
  });
}

export function useRoomCreate(
  autoValidate = false,
  autoSync = false,
): UseStruct<RoomCreate> {
  const states = {
    name: useState(''),
    description: useState(''),
    openToJoin: useState(true),
  };

  return useStruct<RoomCreate>({
    states,
    autoValidate,
    validator: (room) => validateRoomCreate(room),
    autoSync,
    remoteUpdate: (newRoom: Room) =>
      api<RoomCreate>('post', `api/rooms`, newRoom).then((data) => {
        if (data) return data;
      }),
  });
}
