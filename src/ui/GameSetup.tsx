import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import GameTitle from './GameTitle';
import Popup from './Popup';

const GameSetup: FunctionalComponent = () => {
  const { game } = useGameContext();

  return (
    <Popup>
      <GameTitle />
    </Popup>
  );
};

export default GameSetup;
