import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { buttonCss, theme } from '../utils/style';
import Chat from './Chat';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';
import PageWrapper from './PageWrapper';
import Settings from './Settings';

const GamePage: FunctionalComponent<{
  openSharePopup: () => void;
}> = ({ openSharePopup }) => {
  const { code, game, playerId, error, joinGame } = useGameContext();

  const canJoin = !error && !playerId && !!game;

  return (
    <PageWrapper>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          @media screen and (orientation: landscape) {
            flex-direction: row;
            align-items: flex-start;
          }
        `}
      >
        <div
          className={css`
            padding-bottom: 1.5rem;
            width: 100%;
            max-width: 67vh;
            @media screen and (orientation: landscape) {
              max-width: 45%;
              padding: 0 2rem 0 0;
              flex-grow: 1;
            }
          `}
        >
          <h1
            className={css`
              font-size: 1.5rem;
              margin: 0 0 0.75rem;
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
          <GameInfo />
          {canJoin && (
            <MiniForm
              inputName="player-name"
              label="Name"
              buttonText="Join"
              buttonColor="green"
              onSubmit={name => joinGame(name)}
            />
          )}
          <Chat />
        </div>
        <div
          className={css`
            flex-shrink: 0;
            padding-top: 0.5rem;
            @media screen and (orientation: landscape) {
              margin: 0 auto;
            }
          `}
        >
          <Game />
        </div>
      </div>
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
