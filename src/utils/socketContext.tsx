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
    socket.setSocketErrorHandler(setChannelError);
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
  ) => {
    if (channel) {
      const handleSuccess = (code: string, token: string) => {
        try {
          window.localStorage.setItem(`${code}-host`, token);
          onSuccess(code);
        } catch (e) {
          onError(
            'Could not save host token to local storage. Please check your browser settings.',
          );
        }
      };
      socket.createGame(channel, name, handleSuccess, onError);
    } else {
      setChannelError('No channel found');
    }
  };

  return [channelError, createGame] as const;
};

export const useGameChannel = (
  code: string,
  setInitialData: (game: Game, actions: MoveAction[], roll?: number) => void,
  onGameChange: (game: Game, actions: MoveAction[], changes: Changes) => void,
  onRoll: (roll: number) => void,
  onMessage: (message: ChatMessage) => void,
) => {
  const socket = useSocket();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState('');
  const [player, setPlayer] = useState<{ id: number; token: string } | null>(
    null,
  );
  const [hostToken, setHostToken] = useState<string | null>(null);

  useEffect(() => {
    socket.setSocketErrorHandler(setError);
    if (!channel) {
      const gameChannel = socket.joinGameChannel(
        code,
        setInitialData,
        (g, a, c) => {
          onGameChange(g, a, c);
          setError('');
        },
        onRoll,
        onMessage,
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
            const { id, token } = JSON.parse(storedPlayer);
            if (typeof id === 'number' && typeof token === 'string') {
              setPlayer({ id, token });
            }
          } catch (e) {
            console.error('Could not parse stored player');
          }
        }
      } catch (e) {
        console.error('Could not read from local storage');
      }
    }
    if (!hostToken) {
      try {
        const storedHostToken = window.localStorage.getItem(`${code}-host`);
        if (storedHostToken) {
          setHostToken(storedHostToken);
        }
      } catch (e) {
        console.error('Could not read from local storage');
      }
    }
  }, []);

  const playerId = player ? player.id : null;

  const joinGame = (name: string) => {
    if (channel) {
      const onSuccess = (id: number, token: string) => {
        try {
          window.localStorage.setItem(code, JSON.stringify({ id, token }));
          setPlayer({ id, token });
        } catch (e) {
          setError(
            'Could not save player token to local storage. Please check your browser settings.',
          );
        }
      };
      socket.joinGame(channel, name, onSuccess, setError);
    } else {
      setError('No channel found');
    }
  };

  const joinTeam = (id: number) =>
    channel && player
      ? socket.joinTeam(channel, player.token, id, () => null, setError)
      : setError(!channel ? 'No channel found' : 'No player found');

  const leaveTeam = () =>
    channel && player
      ? socket.leaveTeam(channel, player.token, () => null, setError)
      : setError(!channel ? 'No channel found' : 'No player found');

  const scrambleTeams = () =>
    channel && hostToken
      ? socket.scrambleTeams(channel, hostToken, () => null, setError)
      : setError(!channel ? 'No channel found' : 'No host token found');

  const startGame = () =>
    channel && hostToken
      ? socket.startGame(channel, hostToken, () => null, setError)
      : setError(!channel ? 'No channel found' : 'No host token found');

  const takeAction = (action: 'roll' | MoveAction) =>
    channel && player
      ? socket.takeAction(
          channel,
          player.token,
          action,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  const penaltyDone = () =>
    channel && player
      ? socket.decrementPenalty(
          channel,
          player.token,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  const fixPenalty = (amount: number) =>
    channel && player
      ? socket.fixPenalty(
          channel,
          player.token,
          amount,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  const postMessage = (message: string) =>
    channel && player
      ? socket.postChatMessage(
          channel,
          player.token,
          message,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  const callOwnHembo = () =>
    channel && player
      ? socket.callOwnHembo(
          channel,
          player.token,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  const callMissedHembo = (color: Color) =>
    channel && player
      ? socket.callMissedHembo(
          channel,
          player.token,
          color,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  const agreeNewRaiseRound = (agree: boolean) =>
    channel && player
      ? socket.agreeNewRaiseRound(
          channel,
          player.token,
          agree,
          () => null,
          () => null,
        )
      : setError(!channel ? 'No channel found' : 'No player found');

  return {
    playerId,
    hostToken,
    error,
    joinGame,
    joinTeam,
    leaveTeam,
    scrambleTeams,
    startGame,
    takeAction,
    penaltyDone,
    fixPenalty,
    postMessage,
    callOwnHembo,
    callMissedHembo,
    agreeNewRaiseRound,
  };
};
