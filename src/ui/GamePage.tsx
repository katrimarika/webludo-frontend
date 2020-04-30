import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { buttonCss, theme } from '../utils/style';
import { colors } from '../utils/validation';
import Chat from './Chat';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import MiniForm from './MiniForm';
import PageWrapper from './PageWrapper';
import Settings from './Settings';
import Spectators from './Spectators';
import TeamContainer from './TeamContainer';

const GamePage: FunctionalComponent<{
  openSharePopup: () => void;
}> = ({ openSharePopup }) => {
  const { code, game, playerId, error, joinGame } = useGameContext();

  const canJoin = !error && !playerId && !!game;

  return (
    <PageWrapper>
      <h1
        className={css`
          font-size: 1.5rem;
          margin: 0 0 1rem;
          text-align: center;
          @media screen and (orientation: landscape) {
            text-align: initial;
          }
        `}
      >
        {game && game.name ? (
          <span>{game.name}</span>
        ) : (
          <span
            className={css`
              color: ${theme.colors.gray};
            `}
          >
            {'<No name>'}
          </span>
        )}
        <button
          className={css`
            font-size: 1rem;
            color: ${theme.colors.gray};
            font-weight: bold;
            border: none;
            background: none;
            padding: 0;
            margin-left: 0.25rem;
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              text-decoration: underline;
            }
          `}
          onClick={openSharePopup}
        >
          {code}
        </button>
      </h1>
      <ErrorMessage
        prefix="Error: "
        text={error}
        styles={css`
          margin-bottom: 0.5rem;
        `}
      />
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          grid-template-rows: 1fr auto 1fr;
          justify-content: stretch;
          align-items: stretch;
          grid-gap: 0.75rem;
          margin-bottom: 1.5rem;
          @media screen and (orientation: landscape) {
            grid-template-columns: 1fr 2fr 1fr;
          }
        `}
      >
        {colors.map(c => (
          <TeamContainer key={`team-${c}`} color={c} />
        ))}
        <div
          className={css`
            justify-self: center;
            grid-column: 1 / span 3;
            grid-row: 2;
            @media screen and (orientation: landscape) {
              grid-column: 2;
              grid-row: 1 / span 3;
            }
          `}
        >
          <Game />
        </div>
      </div>
      <div
        className={css`
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-template-rows: auto auto;
          grid-gap: 1rem 1.5rem;
        `}
      >
        <Chat />
        <Spectators />
      </div>
      {canJoin && (
        <MiniForm
          inputName="player-name"
          title="Join the game"
          label="Name"
          buttonText="Join"
          placeholder="Enter a name to join"
          buttonColor="green"
          onSubmit={name => joinGame(name)}
          extraCss={css`
            margin-top: 2rem;
          `}
        />
      )}
      <div
        className={css`
          margin-top: 2rem;
        `}
      >
        <a
          className={css`
            ${buttonCss('red')}
            text-decoration: none;
          `}
          href="/"
        >
          Exit to lobby
        </a>
        <Settings
          extraCss={css`
            margin-left: 0.75rem;
          `}
        />
      </div>
    </PageWrapper>
  );
};

export default GamePage;
