import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

export type NextAction = 'roll' | 'move' | 'raise/move' | 'raise/roll' | null;

const PlayerInfo: FunctionalComponent<{
  player: Player;
  isCurrent: boolean;
  nextAction: NextAction;
}> = ({ player, isCurrent, nextAction }) => (
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
          `}
        >{` – ${nextAction.toUpperCase()}!`}</span>
      ) : null}
    </div>
  </li>
);

export default PlayerInfo;
