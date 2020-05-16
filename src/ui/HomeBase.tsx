import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';
import { colors } from '../utils/validation';

const HomeBase: FunctionalComponent<{ color: Color }> = ({ color }) => {
  const { ownColor, callOwnHembo, callMissedHembo } = useGameContext();
  const [loading, setLoading] = useState(false);

  const onClick =
    !ownColor || loading
      ? undefined
      : ownColor === color
      ? () => {
          setLoading(true);
          callOwnHembo();
          setTimeout(() => setLoading(false), 500);
        }
      : () => {
          setLoading(true);
          callMissedHembo(color);
          setTimeout(() => setLoading(false), 1000);
        };

  return (
    <g
      className={css`
        transform: rotate(${colors.indexOf(color) * 90}deg);
        transform-origin: center;
      `}
    >
      <svg x="0" y="0" width="1000" height="1000" viewBox="0 0 1000 1000">
        <path
          d={`M2,220 2,160 Q56,56 160,2 L220,2 Q76,76 2,220`}
          className={css`
            stroke: ${theme.colors.black};
            stroke-width: 8;
            fill: ${theme.colors.black};
          `}
        />
        <g
          onClick={onClick}
          className={css`
            transform: rotate(135deg);
            transform-origin: 74px 74px;
            ${onClick &&
              css`
                cursor: pointer;
                &:hover,
                &:focus,
                &:active {
                  rect {
                    fill: ${theme.colors.boardCorner};
                  }
                  text {
                    opacity: 0.75;
                  }
                }
              `}
          `}
        >
          <rect
            x={74}
            y={74}
            height={40}
            width={160}
            rx={50}
            className={css`
              fill: ${theme.colors.black};
              transform: translate(-80px, -31px);
            `}
          />
          <text
            x={74}
            y={74}
            className={css`
              fill: ${theme.colors[color].main};
              font-size: 35px;
              font-weight: bold;
              letter-spacing: 1px;
              text-anchor: middle;
              pointer-events: none;
              user-select: none;
            `}
          >
            hembo
          </text>
        </g>
      </svg>
    </g>
  );
};

export default HomeBase;
