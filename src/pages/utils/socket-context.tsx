import { createContext, ReactElement, useContext } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext<SocketIOClient.Socket>(
  {} as SocketIOClient.Socket,
);

export const useSocket = (): SocketIOClient.Socket =>
  useContext<SocketIOClient.Socket>(SocketContext);

export function SocketContextProvider(props: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const socket = io.connect('http://localhost:3000');

  console.debug('render SocketContextProvider');

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}
