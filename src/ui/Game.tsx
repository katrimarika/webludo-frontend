import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { colors } from '../utils/validation';
import DieSystem from './DieSystem';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GamePieces from './GamePieces';
import HomeBase from './HomeBase';

const Game: FunctionalComponent = () => {
  const { disabled } = useGameContext();

  return (
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
        {colors.map(c => (
          <HomeBase key={`homebase-${c}`} color={c} />
        ))}
        <DieSystem />
        <GamePieces />
        {disabled && <GameOverlay text="" />}
      </svg>
    </svg>
  );
};

export default Game;
