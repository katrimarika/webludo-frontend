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
  currentColor: Color | null;
}> = ({ game, currentColor }) => (
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
        `}
      >
        <div
          className={css`
            flex: 0 0 0.6rem;
            background: ${theme.colors[p.color].main};
            height: 0.6rem;
            width: 0.6rem;
            border-radius: 0.6rem;
            margin-right: 0.4rem;
            animation: ${p.color === currentColor
              ? `${pulseAnimation(p.color)} 1s alternate infinite`
              : 'none'};
          `}
        />
        <div>{`${p.name}${
          status === 'ongoing' && p.color === currentColor ? ' PLAY!' : ''
        }`}</div>
      </li>
    ))}
  </ul>
);

export default GameInfo;
