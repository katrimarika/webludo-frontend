import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { capitalize } from '../utils/helpers';
import { theme } from '../utils/style';
import PlayerNames from './PlayerNames';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const TeamInfo: FunctionalComponent<{
  team: Team;
  players: Player[];
  newRaiseRound: boolean;
}> = ({ team, players, newRaiseRound }) => (
  <Fragment>
    {(team.name || team.color) && (
      <h2
        className={css`
          margin: 0 0 0.25rem;
          line-height: 1.2;
          font-size: 1rem;
          font-weight: bold;
          word-break: break-word;
        `}
      >
        {team.name || `${capitalize(team.color || '')} team`}
      </h2>
    )}
    <PlayerNames players={players} />
    <div
      className={css`
        line-height: 1.2;
      `}
    >
      <span
        className={css`
          white-space: nowrap;
        `}
        title={`Team penalties to complete: ${team.penalties}`}
      >{` 🍺${team.penalties}`}</span>
      {newRaiseRound && (
        <span
          title={`${
            team.newRaiseRound ? 'Agreed' : 'Disagreed'
          } on a new raising round`}
          className={css`
            margin-left: 0.25rem;
          `}
        >
          {team.newRaiseRound ? ' 👍' : ' 👎'}
        </span>
      )}
      {!newRaiseRound && !team.canRaise && (
        <span
          className={css`
            margin-left: 0.25rem;
            font-size: 0.875rem;
            color: ${theme.colors.gray};
          `}
        >
          {' (raised)'}
        </span>
      )}
    </div>
  </Fragment>
);

export default TeamInfo;
