import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Channel, initSocket, NO_SOCKET, SocketActions } from './socket';

const SocketContext = createContext<SocketActions>(NO_SOCKET);

export const SocketProvider: FunctionComponent = ({ children }) => {
  const socket = initSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);

export const useLobbyChannel = () => {
  const socket = useSocket();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [channelError, setChannelError] = useState('');

  useEffect(() => {
    if (!channel) {
      const lobbyChannel = socket.joinLobbyChannel(() => null, setChannelError);
      setChannel(lobbyChannel);
      return () => socket.leaveChannel(lobbyChannel);
    }
  }, []);

  const createGame = (
    name: string,
    onSuccess: (code: string) => void,
    onError: OnError,
  ) =>
    channel
      ? socket.createGame(channel, name, onSuccess, onError)
      : setChannelError('No channel found');

  return [channelError, createGame] as const;
};

export const useGameChannel = (
  code: string,
  onGameChange: (data: Game) => void,
  onStateChange: (state: GameState) => void,
  onRoll: (result: RollResult) => void,
) => {
  const socket = useSocket();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!channel) {
      const gameChannel = socket.joinGameChannel(
        code,
        onGameChange,
        onStateChange,
        onRoll,
        setError,
      );
      setChannel(gameChannel);
      return () => socket.leaveChannel(gameChannel);
    }
  }, []);

  const joinGame = (name: string, onSuccess: (game: Game) => void) =>
    channel
      ? socket.joinGame(channel, name, onSuccess, setError)
      : setError('No channel found');

  const rollDie = () =>
    channel
      ? socket.rollDie(channel, onRoll, setError)
      : setError('No channel found');

  return [error, joinGame, rollDie] as const;
};
