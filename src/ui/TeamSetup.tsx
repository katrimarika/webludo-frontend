import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';
import PlayerNames from './PlayerNames';

const TeamSetup: FunctionalComponent<{
  team: Team;
  index: number;
  players: Player[];
  join?: () => void;
}> = ({ team, index, players, join }) => (
  <button
    key={`team-setup-${team.id}`}
    title={`Join team ${team.name || index}`}
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
      {team.name || `Team ${index}`}
    </div>
    <PlayerNames players={players} wrapAlways={true} />
  </button>
);

export default TeamSetup;
