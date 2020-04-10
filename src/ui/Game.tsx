import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import DieSystem from './DieSystem';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GamePieces from './GamePieces';

const Game: FunctionalComponent<{
  gameState: GameState | null;
  playerColor: Color | null;
  die: DieState;
  disabled?: boolean;
  animationOngoing?: boolean;
  message?: string;
  takeAction: (action: 'roll' | MoveAction) => void;
  actions: MoveAction[];
  onMoveComplete: (type: keyof GameState['changes']) => void;
  onDieAnimationComplete: () => void;
}> = ({
  gameState,
  playerColor,
  die,
  takeAction,
  disabled,
  animationOngoing,
  message,
  actions,
  onMoveComplete,
  onDieAnimationComplete,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={css`
      width: calc(100vw - 3rem);
      height: calc(100vw - 3rem);
      max-width: 67vh;
      max-height: 67vh;
      @media screen and (orientation: landscape) {
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
    <svg width="100%" height="100%" viewBox="0 0 1000 1000">
      <GameBoard />
      <DieSystem
        die={die}
        rollDie={() => takeAction('roll')}
        disabled={
          disabled ||
          !!actions.filter(a => a.type === 'move').length ||
          animationOngoing ||
          !playerColor ||
          !gameState ||
          gameState.currentColor !== playerColor
        }
        onAnimationComplete={onDieAnimationComplete}
      />
      {gameState && (
        <GamePieces
          {...gameState}
          playerColor={playerColor}
          actions={actions}
          takeAction={takeAction}
          onMoveComplete={onMoveComplete}
        />
      )}
      {(message || disabled) && <GameOverlay text={message || ''} />}
    </svg>
  </svg>
);

export default Game;
