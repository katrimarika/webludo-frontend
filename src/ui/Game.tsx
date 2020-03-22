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
  onRoll: () => void;
  disabled?: boolean;
  message?: string;
}> = ({ gameState, playerColor, die, onRoll, disabled, message }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={css`
      flex-shrink: 0;
      width: 22.5rem;
      height: 22.5rem;
      margin: 0 1.2rem;
      max-width: 67vh;
      max-height: 67vh;
      @media screen and (orientation: landscape) {
        width: 27.5rem;
        height: 27.5rem;
        margin: 2rem 1.2rem;
        max-width: 55vw;
        max-height: 55vw;
      }
    `}
  >
    <svg width="100%" height="100%" viewBox="0 0 1000 1000">
      <GameBoard />
      {gameState && <GamePieces {...gameState} />}
      <DieSystem
        die={die}
        onRoll={onRoll}
        disabled={
          disabled ||
          !playerColor ||
          !gameState ||
          gameState.currentColor !== playerColor
        }
      />
      {(message || disabled) && <GameOverlay text={message || ''} />}
    </svg>
  </svg>
);

export default Game;
