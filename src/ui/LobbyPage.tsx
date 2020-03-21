import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { setHash } from '../utils/hash';
import { Channel, SocketHandler } from '../utils/socket';
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
        e => setLobbyError(e),
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
          font-size: 1.5rem;
          margin: 0 0 1.2rem;
        `}
      >
        KimbIe
      </h1>
      <ErrorMessage prefix="Lobby error: " text={lobbyError} />
      <MiniForm
        inputName="game-code"
        title="Open an existing game"
        label="Game code"
        buttonText="Open"
        onSubmit={v => setHash(v.toLowerCase())}
      />
      <MiniForm
        inputName="game-name"
        title="Create a game"
        label="Name"
        buttonText="Create"
        buttonColor="green"
        inputWidth="long"
        onSubmit={v =>
          channel && socket
            ? socket.createGame(channel, v, setHash, e => setCreateError(e))
            : null
        }
      >
        <ErrorMessage
          prefix="Create game failed: "
          text={createError}
          styles={css`
            margin-top: 0.6rem;
          `}
        />
      </MiniForm>
    </div>
  );
};

export default LobbyPage;
