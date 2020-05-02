import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import Button from './Button';

const StartGame: FunctionalComponent = () => {
  const { game, hostToken, startGame } = useGameContext();

  const canBeStarted = game && game.canBeStarted;

  return (
    <Fragment>
      <div>
        {!canBeStarted
          ? 'Waiting for players...'
          : !hostToken
          ? 'Waiting for host to start the game...'
          : 'You cannot edit the teams after starting.'}
      </div>
      {!!hostToken && (
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
      )}
    </Fragment>
  );
};

export default StartGame;
