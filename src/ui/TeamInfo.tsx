import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';
import Button from './Button';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const TeamInfo: FunctionalComponent<{
  team: Team;
  players: Player[];
  isCurrent: boolean;
  nextAction: NextAction;
  newRaiseRound: boolean;
  onPenaltyDone?: () => void;
  onToggleAgree?: () => void;
}> = ({
  team,
  players,
  isCurrent,
  nextAction,
  newRaiseRound,
  onPenaltyDone,
  onToggleAgree,
}) => (
  <li
    className={css`
      padding: 0.25rem 0.5rem;
      border-radius: 0.1875rem;
      background: ${isCurrent ? theme.colors.highlight : 'transparent'};
      li + & {
        margin-top: 0.25rem;
      }
    `}
  >
    <div
      className={css`
        display: flex;
        align-items: center;
        line-height: 1.2;
      `}
    >
      <div
        className={css`
          flex: 0 0 0.625rem;
          background: ${team.color
            ? theme.colors[team.color].main
            : theme.colors.gray};
          height: 0.625rem;
          width: 0.625rem;
          border-radius: 0.625rem;
          margin-right: 0.5rem;
        `}
      />
      <div>
        <span
          className={css`
            word-break: break-word;
          `}
        >
          {team.name}
        </span>
        {isCurrent && (
          <span
            className={css`
              font-size: 0.875rem;
              color: ${theme.colors.gray};
              white-space: nowrap;
              display: inline-block;
              min-width: 6.45rem;
            `}
          >
            {`\u00a0–${nextAction ? ` ${nextAction.toUpperCase()}!` : ''}`}
          </span>
        )}
      </div>
      <div
        className={css`
          margin-left: auto;
          white-space: nowrap;
        `}
      >
        <span>{`🍺${team.penalties}`}</span>
        {!!onPenaltyDone && (
          <Button
            color="yellow"
            extraCss={css`
              margin-left: 0.5rem;
              padding: 0.125rem 0.5rem 0.1875rem 0.6875rem;
            `}
            onClick={onPenaltyDone}
            title="Penalty done"
          >
            –🍺
          </Button>
        )}
        {newRaiseRound &&
          (onToggleAgree ? (
            <Button
              color="yellow"
              extraCss={css`
                margin-left: 0.5rem;
                padding: 0.125rem 0.5rem 0.1875rem 0.6875rem;
              `}
              onClick={onToggleAgree}
              title={`Change to ${
                team.newRaiseRound ? 'disagree' : 'agree'
              } on a new raising round`}
            >
              {team.newRaiseRound ? '👍' : '👎'}
            </Button>
          ) : (
            <span
              title={`${
                team.newRaiseRound ? 'Agreed' : 'Disagreed'
              } on a new raising round`}
              className={css`
                margin-left: 1rem;
              `}
            >
              {team.newRaiseRound ? '👍' : '👎'}
            </span>
          ))}
      </div>
    </div>
    <div
      className={css`
        font-size: 0.875rem;
        line-height: 1.33;
        padding-top: 0.125rem;
        padding-left: 1.125rem; /* to align with team name */
      `}
    >
      {players.length ? players.map(p => p.name).join(' • ') : 'no players'}
    </div>
  </li>
);

export default TeamInfo;
