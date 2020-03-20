import { css } from 'emotion';
import { FunctionalComponent, h, JSX } from 'preact';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GamePieces from './GamePieces';

const Game: FunctionalComponent<{ gameState: RemoteData<GameState> }> = ({
  gameState,
}) => {
  let stateContent: JSX.Element | null = null;
  switch (gameState.status) {
    case 'NOT_ASKED':
      stateContent = <GameOverlay text="No game state!" />;
      break;
    case 'ASKED':
      stateContent = <GameOverlay text="Loading game state..." />;
      break;
    case 'ERROR':
      stateContent = <GameOverlay text={`Error: ${gameState.error}`} />;
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
