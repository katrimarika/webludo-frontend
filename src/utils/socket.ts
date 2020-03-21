import { Socket, Channel as PhoenixChannel } from 'phoenix';

export type Channel = PhoenixChannel;

type OnError = (e: string) => void;
const onErrorStr = (onError: OnError) => (e: any) =>
  onError(JSON.stringify(e, null, 2));

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
    onSuccess: (id: string) => void,
    onError: OnError,
  ) => {
    channel
      .push('create_game', {})
      .receive('ok', resp => {
        if (resp && resp.code && typeof resp.code === 'string') {
          onSuccess(resp.code);
        } else {
          onError('No valid code received');
        }
      })
      .receive('error', onErrorStr(onError));
  };

  const joinGameChannel = (
    id: string,
    onSuccess: (data: { game: Game; state: GameState }) => void,
    onError: OnError,
  ) => {
    const channel = socket.channel(`games:${id}`, {});
    channel
      .join()
      .receive('ok', resp => {
        // TODO: validate
        onSuccess(resp);
      })
      .receive('error', onErrorStr(onError));
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
        // TODO: validate data
        onSuccess(resp);
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
