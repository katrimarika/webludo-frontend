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

const GameInfo: FunctionalComponent<{
  game: Game;
  playerColor: Color | null;
  currentColor: Color | null;
}> = ({ game, playerColor, currentColor }) => (
  <ul
    className={css`
      margin: 0;
      padding: 0;
      list-style-type: none;
    `}
  >
    {game.players.map(p => (
      <li
        key={`player-${p.name}`}
        className={css`
          display: flex;
          align-items: center;
          line-height: 1.4;
          padding: 0.1875rem 0.5rem;
          border-radius: 0.1875rem;
          background: ${p.color === currentColor
            ? theme.colors.highlight
            : 'transparent'};
        `}
      >
        <div
          className={css`
            flex: 0 0 0.625rem;
            background: ${theme.colors[p.color].main};
            height: 0.625rem;
            width: 0.625rem;
            border-radius: 0.625rem;
            margin-right: 0.5rem;
            animation: ${p.color === currentColor
              ? `${pulseAnimation(p.color)} 1s alternate infinite`
              : 'none'};
          `}
        />
        <div
          className={css`
            font-weight: ${p.color === playerColor ? '700' : '400'};
          `}
        >{`${p.name}${p.color === currentColor ? ' PLAY!' : ''}`}</div>
      </li>
    ))}
  </ul>
);

export default GameInfo;
