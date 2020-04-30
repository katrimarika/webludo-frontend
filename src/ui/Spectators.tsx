import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import PlayerNames from './PlayerNames';

const Spectators: FunctionalComponent = () => {
  const { game } = useGameContext();

  if (!game) {
    return null;
  }

  const { players } = game;

  return (
    <div>
      <h2
        className={css`
          font-size: 1rem;
          margin: 0.75rem 0 0.25rem;
        `}
      >
        Spectators
      </h2>
      <PlayerNames players={players.filter(p => !p.teamId)} />
    </div>
  );
};

export default Spectators;
