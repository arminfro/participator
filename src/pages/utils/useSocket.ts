import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Events } from '../../types/chat';
import { transformDateString } from './get-initial-props';
import { getToken } from './token';

type EffectFuncs = {
  [P in Events]?: (...args: any) => void;
};

interface WithId {
  id: number;
}

export function useSocket<T extends WithId>(
  namespace: string,
  effectFuncs: EffectFuncs = {},
): [T[], SocketIOClient.Socket] {
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
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit(Events.findAll, (data: T[]) => {
        console.debug('socket data find all', data, namespace);
        return setData(transformDateString(data));
      });

      socket.on(Events.create, (data: T) => {
        const newData = transformDateString(data);
        setData((currData) => [...currData, newData]);
        console.debug('socket data create', newData);
        effectFuncs[Events.create] && effectFuncs[Events.create](newData);
      });

      socket.on(Events.update, (updatedData: T) => {
        const newData = transformDateString(updatedData);
        console.debug('socket data update', newData);
        setData((datas) => {
          return datas.map((data) => {
            return data.id === newData.id ? newData : data;
          });
        });
        effectFuncs[Events.update] && effectFuncs[Events.update](updatedData);
      });

      socket.on(Events.remove, (deletedId: number) => {
        setData((datas) => {
          return datas.filter((data) => {
            return data.id !== deletedId;
          });
        });
        effectFuncs[Events.remove] && effectFuncs[Events.remove](deletedId);
      });
    });
    return () => {
      socket.off(Events.create);
      socket.off(Events.update);
    };
  }, [namespace, socket, effectFuncs]);
  return [data, socket];
}
