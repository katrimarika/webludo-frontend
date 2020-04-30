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
    <div
      className={css`
        grid-column: 1 / span 2;
        grid-row: 2;
        @media screen and (orientation: landscape) {
          grid-column: 2;
          grid-row: 1 / span 2;
        }
      `}
    >
      <h2
        className={css`
          font-size: 1rem;
          margin: 0 0 0.25rem;
        `}
      >
        Spectators
      </h2>
      <PlayerNames players={players.filter(p => !p.teamId)} />
    </div>
  );
};

export default Spectators;
