import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { setHash } from '../utils/hash';
import { Channel, SocketHandler } from '../utils/socket';
import { buttonCss } from '../utils/style';
import ErrorMessage from './ErrorMessage';
import MiniForm from './MiniForm';

const LobbyPage: FunctionalComponent<{ socket: SocketHandler }> = ({
  socket,
}) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [lobbyError, setLobbyError] = useState('');
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (socket && !channel) {
      const lobbyChannel = socket.joinLobbyChannel(
        () => null,
        e => {
          setChannel(null);
          setLobbyError(e);
        },
      );
      setChannel(lobbyChannel);
      return () => socket.leaveChannel(lobbyChannel);
    }
  }, []);

  return (
    <div
      className={css`
        padding: 1.2rem;
      `}
    >
      <h1
        className={css`
          display: flex;
          align-items: center;
          margin: 0 0 1.2rem;
        `}
      >
        Kimble
      </h1>
      <ErrorMessage prefix="Lobby error: " text={lobbyError} />
      <MiniForm
        name="game-id"
        label="Game"
        buttonText="Open"
        onSubmit={v => setHash(v)}
      />
      <button
        type="button"
        disabled={!socket || !channel}
        className={buttonCss('green')}
        onClick={() =>
          channel && socket
            ? socket.createGame(channel, setHash, e => setCreateError(e))
            : null
        }
      >
        New game
      </button>
      <ErrorMessage
        prefix="Create game failed: "
        text={createError}
        styles={css`
          margin-top: 0.6rem;
        `}
      />
    </div>
  );
};

export default LobbyPage;
