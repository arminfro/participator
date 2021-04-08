import { useState } from 'react';
import { Room, RoomCreate, RoomUpdate } from '../../../types/room';
import {
  validateRoomCreate,
  validateRoomUpdate,
} from '../../../types/room.validation';
import api from '../funcs/api';
import { SetCallback, useStruct, UseStructWithValidation } from './use-struct';

export function useRoomUpdate(
  roomId: number,
  room: Room,
  autoValidate = false,
  autoSync = false,
): UseStructWithValidation<RoomUpdate> {
  const states = {
    name: useState(room.name),
    description: useState(room.description),
    openToJoin: useState(room.openToJoin),
  };

  return useStruct<RoomUpdate>({
    states,
    validator: (room: Room) => validateRoomUpdate(room),
    update: (callback: SetCallback<RoomUpdate>, newRoom: Room) =>
      api('patch', `api/rooms/${roomId}`, callback, newRoom),
    autoSync,
    autoValidate,
  });
}

export function useRoomCreate(
  autoValidate = false,
  autoSync = false,
): UseStructWithValidation<RoomCreate> {
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
