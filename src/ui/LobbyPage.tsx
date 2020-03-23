import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useLobbyChannel } from '../utils/context';
import { setHash } from '../utils/hash';
import ErrorMessage from './ErrorMessage';
import MiniForm from './MiniForm';

const LobbyPage: FunctionalComponent = () => {
  const [channelError, createGame] = useLobbyChannel();
  const [createError, setCreateError] = useState('');

  return (
    <div
      className={css`
        padding: 1.2rem;
        @media screen and (orientation: landscape) {
          padding: 1.2rem 3rem;
        }
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
      <ErrorMessage prefix="Error: " text={channelError} />
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
        onSubmit={v => createGame(v, setHash, e => setCreateError(e))}
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
