import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GamePieces from './GamePieces';

const Game: FunctionalComponent<{
  gameState: GameState | null;
  disabled?: boolean;
  message?: string;
}> = ({ gameState, disabled, message }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={css`
      flex-shrink: 0;
      width: 22.5rem;
      height: 22.5rem;
      margin: 0 1.2rem;
      @media screen and (orientation: landscape) {
        width: 20rem;
        height: 20rem;
        margin: 2rem 1.2rem;
      }
    `}
  >
    <GameBoard />
    {gameState && <GamePieces {...gameState} />}
    {(message || disabled) && <GameOverlay text={message || ''} />}
  </svg>
);

export default Game;
