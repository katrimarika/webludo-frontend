import { Channel as PhoenixChannel, Socket } from 'phoenix';
import { toGame, toGameState, toStr, toInt } from './helpers';

export type Channel = PhoenixChannel;

const onErrorStr = (onError: OnError) => (e: any) => {
  const errorStr = JSON.stringify(e, null, 2);
  return onError(errorStr);
};

const initSocketWithUrl = (url: string) => {
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
    onRoll: (result: RollResult) => void,
    onError: OnError,
  ) => {
    const channel = socket.channel(`games:${code.toLowerCase()}`, {});
    channel
      .join()
      .receive('ok', resp => {
        const game = toGame(resp);
        const state = toGameState(resp && resp.game_state);
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
    // Listen to game change events
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
    channel.on('roll', resp => {
      const val = toInt(resp.result);
      if (val > 0 && val <= 6) {
        onRoll({ roll: val, actions: [] });
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
        const game = toGame(resp && resp.game);
        if (game) {
          onSuccess(game);
        } else {
          onError('Invalid game data');
        }
      })
      .receive('error', onErrorStr(onError));
  };

  const rollDie = (
    channel: Channel,
    onSuccess: (result: RollResult) => void,
    onError: OnError,
  ) => {
    channel
      .push('roll', {})
      .receive('ok', resp => {
        const roll = toInt(resp && resp.result);
        if (roll) {
          onSuccess({ roll, actions: [] });
        } else {
          onError('Invalid roll data');
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
    rollDie,
  };
};

export type SocketActions = ReturnType<typeof initSocketWithUrl>;

const noop: (...args: any[]) => any = () => {
  // no-op
};
export const NO_SOCKET: SocketActions = {
  joinLobbyChannel: noop,
  joinGameChannel: noop,
  leaveChannel: noop,
  createGame: noop,
  joinGame: noop,
  rollDie: noop,
};

export const initSocket = (): SocketActions => {
  const url = process.env.SOCKET_URL;
  if (!url) {
    console.error('No socket connection url!');
    return NO_SOCKET;
  }
  return initSocketWithUrl(url);
};
