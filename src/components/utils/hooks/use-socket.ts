import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Events } from '../../../types/chat';
import { transformDateString } from '../../../utils/transform-tree';
import { getToken } from '../funcs/token';
import { noop } from '../../../constants';
import { isDev } from '../../../utils/environment';
import { message } from 'antd';

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

interface Exception {
  status: string;
  message: string;
}

export function useSocket<T extends WithId>(
  namespace: string,
  effectFuncs: EffectFuncs<T> = {},
  dataProp: T = undefined,
  errorFunc: (error: string, failures: string[]) => void = noop,
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
  const [data, setData] = useState<T>(
    dataProp ? transformDateString<T>(dataProp) : undefined,
  );

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit(Events.findAll, (data: T) => {
        effectFuncs[Events.findAll] && // || dataProp
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

      socket.on(Events.remove, (deleteObj: { id: number } | T) => {
        effectFuncs[Events.remove] &&
          effectFuncs[Events.remove](deleteObj, setData, socket);
      });

      socket.on(Events.exception, (exception: Exception) => {
        const [exMessage, ...failures] = exception.message.split('\n');
        if (isDev()) message.error(exMessage);
        errorFunc(exMessage, failures);
      });
    });
    return () => {
      socket.off(Events.create);
      socket.off(Events.update);
      socket.off(Events.remove);
      socket.off(Events.exception);
    };
  }, [namespace, socket, effectFuncs, errorFunc]);
  return [data, socket];
}
