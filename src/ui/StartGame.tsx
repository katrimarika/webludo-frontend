import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import Button from './Button';

const StartGame: FunctionalComponent = () => {
  const { game, hostToken, startGame } = useGameContext();

  if (!game || !game.canBeStarted) {
    return <div>Waiting for players...</div>;
  }

  if (!hostToken) {
    return <div>Waiting for host to start the game...</div>;
  }

  return (
    <Button color="green" onClick={() => startGame()}>
      Start game
    </Button>
  );
};

export default StartGame;
