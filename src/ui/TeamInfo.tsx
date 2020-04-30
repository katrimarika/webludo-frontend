import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';
import PlayerNames from './PlayerNames';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const TeamInfo: FunctionalComponent<{
  team: Team;
  players: Player[];
  isOwn: boolean;
  isCurrent: boolean;
  nextAction: NextAction;
  newRaiseRound: boolean;
}> = ({ team, players, isCurrent, nextAction, newRaiseRound }) => (
  <Fragment>
    <h3
      className={css`
        margin: 0 0 0.25rem;
        line-height: 1.2;
        font-size: 1rem;
        word-break: break-word;
      `}
    >
      {team.name}
    </h3>
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
        >
          {team.newRaiseRound ? '👍' : '👎'}
        </span>
      )}
    </div>
    {isCurrent && (
      <div
        className={css`
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: ${theme.colors.gray};
        `}
      >
        {`\u00a0–${nextAction ? ` ${nextAction.toUpperCase()}!` : ''}`}
      </div>
    )}
  </Fragment>
);

export default TeamInfo;
