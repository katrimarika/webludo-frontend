import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { setHash } from '../utils/hash';
import { Socket } from '../utils/socket';
import { buttonCss } from '../utils/style';
import MiniForm from './MiniForm';

const LobbyPage: FunctionalComponent<{ socket: Socket }> = ({ socket }) => {
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
        Kimble Lobby
      </h1>
      <MiniForm
        name="game-id"
        label="Game"
        buttonText="Open"
        onSubmit={v => setHash(v)}
      />
      <div>
        <button
          type="button"
          disabled={!socket}
          className={buttonCss('green')}
          onClick={() =>
            socket
              ? socket.create(id => {
                  if (id && typeof id === 'string') {
                    setHash(id);
                  }
                })
              : null
          }
        >
          New game
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
