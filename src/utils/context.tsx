import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Channel, initSocket, NO_SOCKET, SocketActions } from './socket';
import { colors } from './helpers';

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
  const [player, setPlayer] = useState<{ color: Color; token: string } | null>(
    null,
  );

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

  useEffect(() => {
    if (!player) {
      try {
        const storedPlayer = window.localStorage.getItem(code);
        if (storedPlayer) {
          try {
            const { color, token } = JSON.parse(storedPlayer);
            if (
              color &&
              colors.indexOf(color) !== -1 &&
              typeof token === 'string'
            ) {
              setPlayer({ color, token });
            }
          } catch (e) {
            console.error('Could not parse stored player');
          }
        }
      } catch (e) {
        console.error('Could not read from local storage');
      }
    }
  }, []);

  const playerColor = player ? player.color : null;

  const joinGame = (name: string) => {
    if (channel) {
      const onSuccess = (color: Color, token: string) => {
        setPlayer({ color, token });
        try {
          window.localStorage.setItem(code, token);
        } catch (e) {
          console.error('Could not save token to local storage');
        }
      };
      socket.joinGame(channel, name, onSuccess, setError);
    } else {
      setError('No channel found');
    }
  };

  const rollDie = () =>
    channel
      ? socket.rollDie(channel, () => null, setError)
      : setError('No channel found');

  return [playerColor, error, joinGame, rollDie] as const;
};
