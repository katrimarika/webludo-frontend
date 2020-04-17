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
      line-height: 1.4;
      padding: 0.1875rem 0.5rem;
      border-radius: 0.1875rem;
      background: ${isCurrent ? theme.colors.highlight : 'transparent'};
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
      <span>{player.name}</span>
      {isCurrent && nextAction ? (
        <span
          className={css`
            font-size: 0.875rem;
            color: ${theme.colors.gray};
            white-space: nowrap;
          `}
        >{` – ${nextAction.toUpperCase()}!`}</span>
      ) : null}
    </div>
    <div
      className={css`
        margin-left: auto;
      `}
    >
      <span
        className={css`
          white-space: nowrap;
        `}
      >{`🍺${player.penalties}`}</span>
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
