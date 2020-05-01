import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const TeamSetup: FunctionalComponent<{
  team: Team;
  title: string;
  playerId: number | null;
  players: Player[];
  join?: () => void;
}> = ({ team, title, playerId, players, join }) => (
  <button
    key={`team-setup-${team.id}`}
    title={`Join team ${title}`}
    className={css`
      background: none;
      border: 2px solid transparent;
      padding: 0.25rem 0.5rem;
      margin: -0.25rem -0.5rem;
      text-align: initial;
      display: flex;
      flex-direction: column;
      color: ${theme.colors.black};
      font-family: inherit;
      border-radius: 4px;
      &:not(:disabled) {
        cursor: pointer;
        &:hover,
        &:focus,
        &:active {
          border-color: ${theme.colors.blue.main};
        }
      }
      &:disabled {
        background: ${theme.colors.highlight};
        border-color: ${theme.colors.blue.main};
      }
    `}
    onClick={join}
    disabled={!join}
  >
    <div
      className={css`
        margin: 0 0 0.25rem;
        font-size: 1rem;
        font-weight: bold;
        word-break: break-word;
      `}
    >
      {title}
    </div>
    {players.map(p => (
      <div
        key={`setup-player-${team.id}-${p.id}`}
        className={css`
          line-height: 1.2;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          font-weight: ${p.id === playerId ? 'bold' : 'normal'};
        `}
      >
        {p.name}
      </div>
    ))}
    {!players.length && (
      <div
        className={css`
          line-height: 1.2;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: ${theme.colors.gray};
        `}
      >
        no players
      </div>
    )}
  </button>
);

export default TeamSetup;
