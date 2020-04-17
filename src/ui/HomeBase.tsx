import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { theme } from '../utils/style';
import { colors } from '../utils/validation';
import { useGameContext } from '../utils/gameContext';

const HomeBase: FunctionalComponent<{ color: Color }> = ({ color }) => {
  const { playerColor, callOwnHembo, callMissedHembo } = useGameContext();

  const onClick =
    playerColor === color
      ? callOwnHembo
      : !!playerColor
      ? () => callMissedHembo(color)
      : undefined;

  return (
    <g
      className={css`
        transform: rotate(${colors.indexOf(color) * 90}deg);
        transform-origin: center;
      `}
    >
      <svg
        x="0"
        y="0"
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
        onClick={onClick}
        className={
          onClick &&
          css`
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              path {
                stroke: ${theme.colors.boardCorner};
                fill: ${theme.colors.boardCorner};
              }
              text {
                opacity: 0.75;
              }
            }
          `
        }
      >
        <path
          d={`M2,220 2,160 Q56,56 160,2 L220,2 Q76,76 2,220`}
          className={css`
            stroke: ${theme.colors.black};
            stroke-width: 8;
            fill: ${theme.colors.black};
          `}
        />
        <g
          className={css`
            transform: rotate(135deg);
            transform-origin: 74px 74px;
          `}
        >
          <text
            x={74}
            y={74}
            className={css`
              fill: ${theme.colors[color].main};
              font-size: 35px;
              font-weight: bold;
              letter-spacing: 1px;
              text-anchor: middle;
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
