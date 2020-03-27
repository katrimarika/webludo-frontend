import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameChannel } from '../utils/context';
import { noActions } from '../utils/helpers';
import { theme } from '../utils/style';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';
import PageWrapper from './PageWrapper';

const GamePage: FunctionalComponent<{
  code: string;
}> = ({ code }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [die, setDie] = useState<DieState>({
    roll: Math.ceil(Math.random() * 6),
    position: Math.random(),
    orientation: Math.random(),
  });
  const [actions, setActions] = useState<Actions>(noActions);
  const [playerColor, error, joinGame, takeAction] = useGameChannel(
    code,
    game => setGame(game),
    state => setGameState(state),
    (roll, actions) => {
      setDie({ roll, position: Math.random(), orientation: Math.random() });
      setActions(actions);
    },
    actions => setActions(actions),
  );

  const canJoin = !error && !playerColor && !!game && game.players.length < 4;

  return (
    <PageWrapper
      styles={css`
        display: flex;
        flex-direction: column;
        @media screen and (orientation: landscape) {
          flex-direction: row;
          justify-content: center;
        }
      `}
    >
      <div
        className={css`
          padding-bottom: 1.2rem;
          @media screen and (orientation: landscape) {
            padding: 0 2.4rem 0 0;
            flex-grow: 1;
            width: 35%;
            max-width: 25rem;
          }
        `}
      >
        <h1
          className={css`
            font-size: 1.5rem;
            margin: 0 0 0.8rem;
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
          <span
            className={css`
              font-size: 1rem;
              color: ${theme.colors.gray};
            `}
          >{` ${code}`}</span>
        </h1>
        <ErrorMessage
          prefix="Error: "
          text={error}
          styles={css`
            margin-bottom: 0.6rem;
          `}
        />
        {game && (
          <GameInfo
            game={game}
            playerColor={playerColor}
            currentColor={(gameState && gameState.currentColor) || null}
          />
        )}
        {canJoin && (
          <MiniForm
            inputName="player-name"
            label="Name"
            buttonText="Join"
            buttonColor="green"
            onSubmit={name => joinGame(name)}
          />
        )}
      </div>
      <div
        className={css`
          flex-shrink: 0;
          padding-top: 0.6rem;
          align-self: center;
          @media screen and (orientation: landscape) {
            align-self: flex-start;
          }
        `}
      >
        <Game
          gameState={gameState}
          playerColor={playerColor}
          die={die}
          disabled={!game || !!error}
          availableActions={playerColor ? actions[playerColor] : []}
          takeAction={takeAction}
        />
      </div>
    </PageWrapper>
  );
};

export default GamePage;
