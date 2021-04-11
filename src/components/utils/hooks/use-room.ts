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
    update: useCallback(
      (callback: SetCallback<RoomUpdate>, newRoom: Room) => {
        return api('patch', `api/rooms/${roomId}`, callback, newRoom);
      },
      [roomId],
    ),
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
    update: (callback: SetCallback<RoomCreate>, newRoom: Room) =>
      api<RoomCreate>('post', `api/rooms`, callback, newRoom),
  });
}
