import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import Button from './Button';

const StartGame: FunctionalComponent = () => {
  const { game, hostToken, startGame } = useGameContext();

  const canBeStarted = game && game.canBeStarted;

  if (!hostToken) {
    return (
      <div>
        {!canBeStarted
          ? 'Waiting for players...'
          : 'Waiting for host to start the game...'}
      </div>
    );
  }

  return (
    <Fragment>
      <div
        className={css`
          font-size: 0.875rem;
        `}
      >
        {canBeStarted
          ? 'You can now start the game. Teams cannot be changed after starting.'
          : 'Waiting for players...'}
      </div>
      <Button
        color="green"
        onClick={() => startGame()}
        disabled={!canBeStarted}
        extraCss={css`
          margin-top: 0.5rem;
        `}
      >
        Start game
      </Button>
    </Fragment>
  );
};

export default StartGame;
