import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import Button from './Button';

const StartGame: FunctionalComponent = () => {
  const { hostToken, scrambleTeams } = useGameContext();

  if (!hostToken) {
    return null;
  }

  return (
    <Button
      color="blue"
      onClick={() => scrambleTeams()}
      extraCss={css`
        margin-left: 0.5rem;
      `}
      title="Click to scramble players in teams"
    >
      Scramble
    </Button>
  );
};

export default StartGame;
