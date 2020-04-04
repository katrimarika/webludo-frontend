import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameChannel } from '../utils/context';
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
    distance: Math.random(),
    orientation: Math.random(),
  });
  const [actions, setActions] = useState<MoveAction[]>([]);
  const [playerColor, error, joinGame, takeAction] = useGameChannel(
    code,
    setGame,
    (state, actions) => {
      setGameState(state);
      setActions(actions);
    },
    roll =>
      setDie({
        roll,
        position: Math.random(),
        distance: Math.random(),
        orientation: Math.random(),
      }),
  );

  const canJoin = !error && !playerColor && !!game && game.players.length < 4;

  const disabled = !game || !gameState || !!error;
  const animationOngoing =
    !!gameState &&
    (!!gameState.changes.previousMove || !!gameState.changes.eaten.length);

  return (
    <PageWrapper
      styles={css`
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
            margin-bottom: 0.5rem;
          `}
        />
        {game && (
          <GameInfo
            game={game}
            playerColor={playerColor}
            currentColor={
              disabled || animationOngoing
                ? null
                : (gameState && gameState.currentColor) || null
            }
            nextAction={
              disabled || animationOngoing
                ? null
                : !!actions.length
                ? 'move'
                : 'roll'
            }
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
          padding-top: 0.5rem;
          @media screen and (orientation: landscape) {
            margin: 0 auto;
          }
        `}
      >
        <Game
          gameState={gameState}
          playerColor={playerColor}
          die={die}
          disabled={disabled}
          animationOngoing={animationOngoing}
          actions={actions}
          takeAction={takeAction}
          onMoveComplete={type =>
            setGameState(
              gameState
                ? {
                    ...gameState,
                    changes:
                      type === 'move'
                        ? { ...gameState.changes, previousMove: null }
                        : { ...gameState.changes, eaten: [] },
                  }
                : null,
            )
          }
        />
      </div>
    </PageWrapper>
  );
};

export default GamePage;
