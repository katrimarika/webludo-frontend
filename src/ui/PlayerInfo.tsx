import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';
import Button from './Button';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const PlayerInfo: FunctionalComponent<{
  player: Player;
  isCurrent: boolean;
  nextAction: NextAction;
  newRaiseRound: boolean;
  onPenaltyDone?: () => void;
  onToggleAgree?: () => void;
}> = ({
  player,
  isCurrent,
  nextAction,
  newRaiseRound,
  onPenaltyDone,
  onToggleAgree,
}) => (
  <li
    className={css`
      display: flex;
      align-items: center;
      line-height: 1.2;
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
        flex: 0 0 0.625rem;
        background: ${theme.colors[player.color].main};
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
        {player.name}
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
      <span>{`🍺${player.penalties}`}</span>
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
              player.newRaiseRound ? 'disagree' : 'agree'
            } on a new raising round`}
          >
            {player.newRaiseRound ? '👍' : '👎'}
          </Button>
        ) : (
          <span
            title={`${
              player.newRaiseRound ? 'Agreed' : 'Disagreed'
            } on a new raising round`}
            className={css`
              margin-left: 1rem;
            `}
          >
            {player.newRaiseRound ? '👍' : '👎'}
          </span>
        ))}
    </div>
  </li>
);

export default PlayerInfo;
