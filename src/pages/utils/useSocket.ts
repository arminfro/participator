import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Events } from '../../types/chat';

type EffectFuncs = {
  [P in Events]?: (...args: any) => void;
};

export function useSocket<T>(
  namespace: string,
  effectFuncs: EffectFuncs = {},
): [T[], SocketIOClient.Socket] {
  const [socket] = useState(io.connect(namespace));
  const [data, setData] = useState<T[]>();

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit(Events.findAll, (data: T[]) => {
        console.debug('socket data find all', data, namespace);
        return setData(data);
      });

      socket.on(Events.create, (data: T) => {
        setData((currData) => [...currData, data]);
        console.debug('socket data create', data);
        effectFuncs[Events.create] && effectFuncs[Events.create](data);
      });
      socket.on(Events.update, (data: T) => {
        console.debug('socket data update', data);
        effectFuncs[Events.update] && effectFuncs[Events.update](data);
      });
    });
    return () => {
      socket.off(Events.create);
      socket.off(Events.update);
    };
  }, [namespace, socket, effectFuncs]);
  return [data, socket];
}
