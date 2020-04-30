import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const PlayerNames: FunctionalComponent<{ players: Player[] }> = ({
  players,
}) => {
  const { playerId } = useGameContext();

  return (
    <div
      className={css`
        font-size: 0.875rem;
        line-height: 1.33;
        margin-bottom: 0.25rem;
        word-break: break-word;
      `}
    >
      {players.length
        ? players.map((p, i) => (
            <span key={`player-name-${p.id}`}>
              {i !== 0 && <span>{' • '}</span>}
              <span
                className={
                  p.id === playerId
                    ? css`
                        font-weight: bold;
                      `
                    : undefined
                }
              >
                {p.name}
              </span>
            </span>
          ))
        : 'no players'}
    </div>
  );
};

export default PlayerNames;
