import { Channel as PhoenixChannel, Socket } from 'phoenix';
import { toGame, toGameState, toStr } from './helpers';

export type Channel = PhoenixChannel;

type OnError = (e: string) => void;
const onErrorStr = (onError: OnError) => (e: any) => {
  const errorStr = JSON.stringify(e, null, 2);
  return onError(errorStr);
};

export const initSocket = () => {
  const url = process.env.SOCKET_URL;
  if (!url) {
    console.error('No socket connection url!');
    return;
  }

  const socket = new Socket(url);
  socket.connect();

  // For testing
  // channel.push('throw', payload) returns an error with given payload
  // channel.push('noreply', {}) returns no response, i.e. no receive is triggered

  const joinLobbyChannel = (onSuccess: () => void, onError: OnError) => {
    const channel = socket.channel('lobby', {});
    channel
      .join()
      .receive('ok', onSuccess)
      .receive('error', onErrorStr(onError));
    return channel;
  };

  const leaveChannel = (channel: Channel) => {
    channel.leave();
  };

  const createGame = (
    channel: Channel,
    name: string,
    onSuccess: (code: string) => void,
    onError: OnError,
  ) => {
    channel
      .push('create_game', { name })
      .receive('ok', resp => {
        const code = toStr(resp && resp.code);
        if (code) {
          onSuccess(code);
        } else {
          onError('No valid code received');
        }
      })
      .receive('error', onErrorStr(onError));
  };

  const joinGameChannel = (
    code: string,
    onGameChange: (data: Game) => void,
    onStateChange: (state: GameState) => void,
    onError: OnError,
  ) => {
    const channel = socket.channel(`games:${code.toLowerCase()}`, {});
    channel
      .join()
      .receive('ok', resp => {
        const game = toGame(resp && resp.game);
        const state = toGameState(resp && resp.gamestate);
        if (!game && !state) {
          onError('Invalid game data');
        }
        if (game) {
          onGameChange(game);
        }
        if (state) {
          onStateChange(state);
        }
      })
      .receive('error', onErrorStr(onError));
    // Listen go game change events
    channel.on('game_change', resp => {
      const game = toGame(resp && resp.game);
      if (game) {
        onGameChange(game);
      } else {
        onError('Received invalid game data');
      }
    });
    channel.on('gamestate_change', resp => {
      const state = toGameState(resp && resp.gamestate);
      if (state) {
        onStateChange(state);
      } else {
        onError('Received invalid game state');
      }
    });
    return channel;
  };

  const joinGame = (
    channel: Channel,
    name: string,
    onSuccess: (game: Game) => void,
    onError: OnError,
  ) => {
    channel
      .push('join_game', { name })
      .receive('ok', resp => {
        console.log(resp);
        const game = toGame(resp && resp.game);
        if (game) {
          onSuccess(game);
        } else {
          onError('Invalid game data');
        }
      })
      .receive('error', onErrorStr(onError));
  };

  return {
    joinLobbyChannel,
    leaveChannel,
    createGame,
    joinGameChannel,
    joinGame,
  };
};

export type SocketHandler = ReturnType<typeof initSocket>;
