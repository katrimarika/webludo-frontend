import { Channel as PhoenixChannel, Socket } from 'phoenix';
import {
  colors,
  toChanges,
  toChatMessage,
  toGame,
  toInt,
  toMoveActions,
  toStr,
} from './validation';

export type Channel = PhoenixChannel;

const onErrorStr = (onError: OnError) => (e: any) => {
  const errorStr = JSON.stringify(e, null, 2);
  return onError(errorStr);
};

const log =
  window.location.hostname === 'localhost'
    ? (...args: any[]) => {
        console.log('[SOCKET]', ...args);
      }
    : () => null;

const initSocketWithUrl = (url: string) => {
  const socket = new Socket(url);
  socket.connect();

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
    setInitialData: (game: Game, actions: MoveAction[], roll?: number) => void,
    onGameChange: (game: Game, actions: MoveAction[], changes: Changes) => void,
    onRoll: (roll: number) => void,
    onChatMessage: (newData: ChatMessage) => void,
    onError: OnError,
  ) => {
    const channel = socket.channel(`games:${code.toLowerCase()}`, {});
    channel
      .join()
      .receive('ok', resp => {
        log('joined game channel', resp);
        const game = toGame(resp && resp.game);
        const roll = toInt(resp && resp.game && resp.game.roll);
        const actions = toMoveActions(resp && resp.actions);
        if (!game || !actions) {
          onError('Invalid game data');
        }
        if (game && actions) {
          setInitialData(
            game,
            actions,
            roll > 0 && roll <= 6 ? roll : undefined,
          );
        }
      })
      .receive('error', onErrorStr(onError));
    // Listen to game change events
    channel.on('game_updated', resp => {
      log('received game_updated', resp);
      const game = toGame(resp && resp.game);
      const changes = toChanges(resp && resp.changes);
      const actions = toMoveActions(resp && resp.actions);
      if (game && actions && changes) {
        onGameChange(game, actions, changes);
      } else {
        onError('Received invalid game data');
      }
    });
    channel.on('roll', resp => {
      log('received roll', resp);
      const val = toInt(resp.result);
      if (val > 0 && val <= 6) {
        onRoll(val);
      } else {
        onError('Received invalid roll result');
      }
    });
    channel.on('chat', resp => {
      log('received chat message', resp);
      const message = toChatMessage(resp);
      if (message) {
        onChatMessage(message);
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

  const decrementPenalty = (
    channel: Channel,
    token: string,
    onSuccess: () => void,
    onError: OnError,
  ) => {
    channel
      .push('decrement_penalty', { token })
      .receive('ok', onSuccess)
      .receive('error', onErrorStr(onError));
  };

  const fixPenalty = (
    channel: Channel,
    token: string,
    amount: number,
    onSuccess: () => void,
    onError: OnError,
  ) => {
    channel
      .push('set_penalty', { token, amount })
      .receive('ok', onSuccess)
      .receive('error', onErrorStr(onError));
  };

  const postChatMessage = (
    channel: Channel,
    token: string,
    message: string,
    onSuccess: () => void,
    onError: OnError,
  ) => {
    channel
      .push('chat', { token, message })
      .receive('ok', onSuccess)
      .receive('error', onErrorStr(onError));
  };

  const callOwnHembo = (
    channel: Channel,
    token: string,
    onSuccess: () => void,
    onError: OnError,
  ) => {
    channel
      .push('jag_bor_i_hembo', { token })
      .receive('ok', onSuccess)
      .receive('error', onErrorStr(onError));
  };

  const callMissedHembo = (
    channel: Channel,
    token: string,
    player: Color,
    onSuccess: () => void,
    onError: OnError,
  ) => {
    channel
      .push('call_missed_hembo', { token, player })
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
    decrementPenalty,
    fixPenalty,
    postChatMessage,
    callOwnHembo,
    callMissedHembo,
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
  decrementPenalty: noop,
  fixPenalty: noop,
  postChatMessage: noop,
  callOwnHembo: noop,
  callMissedHembo: noop,
};

export const initSocket = (): SocketActions => {
  const url = process.env.SOCKET_URL;
  if (!url) {
    console.error('No socket connection url!');
    return NO_SOCKET;
  }
  return initSocketWithUrl(url);
};
