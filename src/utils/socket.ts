import { Channel as PhoenixChannel, Socket } from 'phoenix';
import {
  colors,
  toGame,
  toGameState,
  toInt,
  toMoveActions,
  toStr,
} from './validation';

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
    onGameChange: (newData: Game) => void,
    onStateChange: (newData: GameState, newActions: MoveAction[]) => void,
    onRoll: (roll: number) => void,
    onError: OnError,
  ) => {
    const channel = socket.channel(`games:${code.toLowerCase()}`, {});
    channel
      .join()
      .receive('ok', resp => {
        console.log('joined game channel', resp);
        const game = toGame(resp && resp.game);
        const state = toGameState(resp && resp.game && resp.game.game_state);
        const roll = toInt(
          resp &&
            resp.game &&
            resp.game.game_state &&
            resp.game.game_state.roll,
        );
        const actions = toMoveActions(resp && resp.actions);
        if (!game || !state || !actions) {
          onError('Invalid game data');
        }
        if (game) {
          onGameChange(game);
        }
        if (state && actions) {
          onStateChange(state, actions);
        }
        if (roll > 0 && roll <= 6) {
          onRoll(roll);
        }
      })
      .receive('error', onErrorStr(onError));
    // Listen to game change events
    channel.on('game_updated', resp => {
      console.log('received game_updated', resp);
      const game = toGame(resp);
      if (game) {
        onGameChange(game);
      } else {
        onError('Received invalid game data');
      }
    });
    channel.on('game_state_updated', resp => {
      console.log('received game_state_updated', resp);
      const state = toGameState(
        resp && resp.game_state,
        resp && resp.previous_move,
      );
      const actions = toMoveActions(resp && resp.actions);
      if (state && actions) {
        onStateChange(state, actions);
      } else {
        onError('Received invalid game state');
      }
    });
    channel.on('roll', resp => {
      console.log('received roll', resp);
      const val = toInt(resp.result);
      if (val > 0 && val <= 6) {
        onRoll(val);
      } else {
        onError('Received invalid roll result');
      }
    });
    return channel;
  };

  const joinGame = (
    channel: Channel,
    name: string,
    onSuccess: (color: Color, token: string) => void,
    onError: OnError,
  ) => {
    channel
      .push('join_game', { name })
      .receive('ok', resp => {
        const token = toStr(resp.token);
        const color = toStr(resp.color) as Color;
        if (token && color && colors.indexOf(color) !== -1) {
          onSuccess(color, token);
        } else {
          onError('No valid token received');
        }
      })
      .receive('error', onErrorStr(onError));
  };

  const takeAction = (
    channel: Channel,
    token: string,
    action: 'roll' | MoveAction,
    onSuccess: () => void,
    onError: OnError,
  ) => {
    channel
      .push(
        'action',
        action === 'roll'
          ? { token, type: 'roll' }
          : {
              token,
              type: 'move',
              move: {
                piece_id: action.pieceId,
                target_area: action.area,
                target_index: action.index,
              },
            },
      )
      .receive('ok', onSuccess)
      .receive('error', onErrorStr(onError));
  };

  return {
    joinLobbyChannel,
    leaveChannel,
    createGame,
    joinGameChannel,
    joinGame,
    takeAction,
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
  takeAction: noop,
};

export const initSocket = (): SocketActions => {
  const url = process.env.SOCKET_URL;
  if (!url) {
    console.error('No socket connection url!');
    return NO_SOCKET;
  }
  return initSocketWithUrl(url);
};
