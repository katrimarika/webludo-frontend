import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameChannel } from '../utils/context';
import { buttonCss, theme } from '../utils/style';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';
import PageWrapper from './PageWrapper';
import { setHash } from '../utils/hash';

const GamePage: FunctionalComponent<{
  code: string;
  openSharePopup: () => void;
}> = ({ code, openSharePopup }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [die, setDie] = useState<DieState>({
    roll: Math.ceil(Math.random() * 6),
    position: Math.random(),
    distance: Math.random(),
    orientation: Math.random(),
    animate: false,
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
        animate: true,
      }),
  );

  const canJoin = !error && !playerColor && !!game && game.players.length < 4;

  const disabled = !game || !gameState || !!error;
  const animationOngoing =
    !!gameState &&
    (!!gameState.changes.previousMove || !!gameState.changes.eaten.length);

  const currentColor =
    disabled || animationOngoing
      ? null
      : (gameState && gameState.currentColor) || null;
  const nextAction =
    disabled || animationOngoing
      ? null
      : actions.some(a => a.type === 'raise')
      ? actions.length > 1
        ? ('raise/move' as const)
        : ('raise/roll' as const)
      : !!actions.length
      ? ('move' as const)
      : ('roll' as const);

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
          {game && (
            <GameInfo
              game={game}
              playerColor={playerColor}
              currentColor={currentColor}
              nextAction={nextAction}
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
            onDieAnimationComplete={() =>
              setDie(prevState => ({ ...prevState, animate: false }))
            }
          />
        </div>
      </div>
      <button
        className={css`
          ${buttonCss('red')}
          margin-top: 2rem;
        `}
        onClick={() => setHash('')}
      >
        Exit
      </button>
    </PageWrapper>
  );
};

export default GamePage;
