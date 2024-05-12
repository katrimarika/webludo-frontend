import { css } from '@emotion/css';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { colors } from '../utils/validation';
import DieSystem from './DieSystem';
import GameBoard from './GameBoard';
import GameOverlay from './GameOverlay';
import GamePieces from './GamePieces';
import HomeBase from './HomeBase';
import NextAction from './NextAction';

const Game: FunctionalComponent = () => {
  const { disabled } = useGameContext();

  return (
    <Fragment>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={css`
          width: 100%;
          height: 100%;
        `}
      >
        <svg width="100%" height="100%" viewBox="0 0 1000 1000">
          <GameBoard />
          {colors.map(c => (
            <HomeBase key={`homebase-${c}`} color={c} />
          ))}
          <DieSystem />
          <GamePieces />
        </svg>
      </svg>
      <NextAction />
      {disabled && <GameOverlay text="" />}
    </Fragment>
  );
};

export default Game;
