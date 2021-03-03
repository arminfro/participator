import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Events } from '../../../types/chat';
import { transformDateString } from '../../../utils/transform-tree';
import { getToken } from '../token';

interface WithId {
  id: number;
}

type EffectFuncs<T extends WithId> = {
  [P in Events]?: (
    payload: T | { id: number },
    setData: Dispatch<SetStateAction<T>>,
    socket: SocketIOClient.Socket,
  ) => void;
};

export function useSocket<T extends WithId>(
  namespace: string,
  effectFuncs: EffectFuncs<T> = {},
): [T, SocketIOClient.Socket] {
  const [socket] = useState(
    io.connect(namespace, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `${getToken()}`,
          },
        },
      },
    }),
  );
  const [data, setData] = useState<T>();

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit(Events.findAll, (data: T) => {
        effectFuncs[Events.findAll] &&
          effectFuncs[Events.findAll](
            transformDateString<T>(data),
            setData,
            socket,
          );
      });

      socket.on(Events.create, (data: T) => {
        effectFuncs[Events.create] &&
          effectFuncs[Events.create](
            transformDateString<T>(data),
            setData,
            socket,
          );
      });

      socket.on(Events.update, (updatedData: T) => {
        effectFuncs[Events.update] &&
          effectFuncs[Events.update](
            transformDateString<T>(updatedData),
            setData,
            socket,
          );
      });

      socket.on(Events.remove, (deletedId: { id: number }) => {
        effectFuncs[Events.remove] &&
          effectFuncs[Events.remove](deletedId, setData, socket);
      });
    });
    return () => {
      socket.off(Events.create);
      socket.off(Events.update);
      socket.off(Events.remove);
    };
  }, [namespace, socket, effectFuncs]);
  return [data, socket];
}
