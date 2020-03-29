import { css, keyframes } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';

const pulseAnimation = (color: Color) => keyframes`
  from {
    background-color: ${theme.colors[color].main};
  }
  to {
    background-color: ${theme.colors[color].text};
  }
`;

const PlayerInfo: FunctionalComponent<{
  player: Player;
  isCurrent: boolean;
}> = ({ player, isCurrent }) => (
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
        animation: ${isCurrent
          ? `${pulseAnimation(player.color)} 1s alternate infinite`
          : 'none'};
      `}
    />
    <div>{`${player.name}${isCurrent ? ' PLAY!' : ''}`}</div>
  </li>
);

export default PlayerInfo;
