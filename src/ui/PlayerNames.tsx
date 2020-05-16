import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const PlayerNames: FunctionalComponent<{
  players: Player[];
  wrapAlways?: boolean;
}> = ({ players, wrapAlways }) => {
  const { playerId } = useGameContext();

  return (
    <div
      className={css`
        font-size: 0.875rem;
        line-height: 1.2;
        margin-bottom: ${wrapAlways ? '0' : '0.25rem'};
        word-break: break-word;
      `}
    >
      {players.length ? (
        players.map((p, i) => (
          <span key={`player-name-${p.id}`}>
            {i !== 0 && !wrapAlways && (
              <span
                className={css`
                  @media screen and (orientation: landscape) {
                    display: none;
                  }
                `}
              >
                {' • '}
              </span>
            )}
            <span
              className={css`
                font-weight: ${p.id === playerId ? 'bold' : 'normal'};
                ${wrapAlways
                  ? css`
                      display: block;
                      margin-bottom: 0.25rem;
                    `
                  : css`
                      @media screen and (orientation: landscape) {
                        display: block;
                      }
                    `}
              `}
            >
              {p.name}
            </span>
          </span>
        ))
      ) : (
        <span
          className={css`
            color: ${theme.colors.gray};
            ${wrapAlways
              ? css`
                  display: block;
                  margin-bottom: 0.25rem;
                `
              : css`
                  @media screen and (orientation: landscape) {
                    display: block;
                  }
                `}
          `}
        >
          no players
        </span>
      )}
    </div>
  );
};

export default PlayerNames;
