import { css } from 'emotion';
import { FunctionalComponent, h, JSX } from 'preact';
import GameBoard from './GameBoard';
import GamePieces from './GamePieces';

const Game: FunctionalComponent<{ gameState: RemoteData<GameState> }> = ({
  gameState,
}) => {
  let stateContent: JSX.Element | null = null;
  const textCss = css`
    text-anchor: middle;
  `;
  switch (gameState.status) {
    case 'NOT_ASKED':
      stateContent = (
        <text x="50%" y="50%" className={textCss}>
          No game state!
        </text>
      );
      break;
    case 'ASKED':
      stateContent = (
        <text x="50%" y="50%" className={textCss}>
          Loading game state...
        </text>
      );
      break;
    case 'ERROR':
      stateContent = (
        <text x="50%" y="50%" className={textCss}>
          Error loading game state: {gameState.error}
        </text>
      );
      break;
    case 'SUCCESS':
      const { currentColor, pieces } = gameState.data;
      stateContent = <GamePieces currentColor={currentColor} pieces={pieces} />;
      break;
    default:
      stateContent = null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={css`
        flex-shrink: 0;
        width: 22.5rem;
        height: 22.5rem;
        margin: 0 1.2rem;
        @media screen and (orientation: landscape) {
          width: 18rem;
          height: 18rem;
          margin: 2rem 1.2rem;
        }
      `}
    >
      <GameBoard />
      {stateContent}
    </svg>
  );
};

export default Game;
