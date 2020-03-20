import * as io from 'socket.io-client';

const noop = () => null;

export type SocketActions = {
  registerHandler: (handler: (...args: any[]) => void) => void;
  unregisterHandler: () => void;
  onError: (callBack: (err: any) => void) => void;
  create: (callback?: (id: string) => void) => void;
  join: (id: string, callback?: (success: boolean) => void) => void;
  leave: (id: string, callback?: (success: boolean) => void) => void;
  getGame: (id: string, callback?: (data: Game) => void) => void;
  getGameState: (id: string, callback?: (data: GameState) => void) => void;
};

export const initSocket = (): SocketActions => {
  const url = process.env.SOCKET_URL;
  if (!url) {
    console.error('No socket connection url!');
    return {
      registerHandler: noop,
      unregisterHandler: noop,
      onError: noop,
      create: noop,
      join: noop,
      leave: noop,
      getGame: noop,
      getGameState: noop,
    };
  }

  const socket = io.connect(url);

  const registerHandler: SocketActions['registerHandler'] = handler => {
    socket.on('message', handler);
  };

  const unregisterHandler = () => {
    socket.off('message');
  };

  const onError: SocketActions['onError'] = callback => {
    socket.on('error', callback);
  };

  const create: SocketActions['create'] = callback => {
    socket.emit('create', null, callback);
  };

  const join: SocketActions['join'] = (id, callback) => {
    socket.emit('join', id, callback);
  };

  const leave: SocketActions['leave'] = (id, callback) => {
    socket.emit('leave', id, callback);
  };

  const getGame: SocketActions['getGame'] = (id, callback) => {
    socket.emit('getGame', id, callback);
  };

  const getGameState: SocketActions['getGameState'] = (id, callback) => {
    socket.emit('getGameState', id, callback);
  };

  return {
    create,
    join,
    leave,
    getGame,
    getGameState,
    registerHandler,
    unregisterHandler,
    onError,
  };
};
