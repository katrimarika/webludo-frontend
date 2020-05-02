import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { buttonCss } from '../utils/style';
import { colors } from '../utils/validation';
import Chat from './Chat';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameSetup from './GameSetup';
import GameTitle from './GameTitle';
import MiniForm from './MiniForm';
import PageWrapper from './PageWrapper';
import Settings from './Settings';
import Spectators from './Spectators';
import TeamContainer from './TeamContainer';

const GamePage: FunctionalComponent = () => {
  const { game, playerId, error, joinGame } = useGameContext();

  const canJoin = !error && !playerId && !!game;

  return (
    <PageWrapper>
      <GameTitle />
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
          grid-template-rows: min-content auto min-content;
          justify-content: stretch;
          align-items: stretch;
          grid-gap: 1rem 0.5rem;
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
            position: relative;
            justify-self: center;
            grid-column: 1 / span 3;
            grid-row: 2;
            width: calc(100vw - 3rem);
            height: calc(100vw - 3rem);
            max-width: 60vh;
            max-height: 60vh;
            @media screen and (orientation: landscape) {
              grid-column: 2;
              grid-row: 1 / span 3;
              width: calc(100vh - 3.5rem);
              height: calc(100vh - 3.5rem);
              max-width: 50vw;
              max-height: 50vw;
            }
            @media screen and (orientation: landscape) and (min-width: 1440px) {
              max-width: 700px;
              max-height: 700px;
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
          inputName="spectator-name"
          title="Join as spectator to chat"
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
      {!!game && !game.hasStarted && <GameSetup />}
    </PageWrapper>
  );
};

export default GamePage;
