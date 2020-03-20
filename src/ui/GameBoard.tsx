import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { colors, goalCoord, homeCoord, playCoord } from '../utils/helpers';
import { theme } from '../utils/theme';

const spotCss = css`
  stroke: black;
  stroke-width: 0.1rem;
  fill: white;
`;
const highlightCss = (i: number) => css`
  stroke-width: 0.15rem;
  stroke: ${theme.colors[colors[i]]};
  fill: transparent;
`;

const GameBoard: FunctionalComponent = () => (
  <svg>
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      rx="15%"
      ry="15%"
      className={spotCss}
    />
    {[...new Array(24)].map((_, i) => (
      <circle
        key={`play-${i}`}
        cx={`${playCoord('x', i)}%`}
        cy={`${playCoord('y', i)}%`}
        r="3%"
        className={spotCss}
      />
    ))}
    {[...new Array(4)].map((_, i) => (
      <Fragment key={`other-${i}`}>
        {[...new Array(4)].map((_, j) => (
          <Fragment key={`other-${i}-${j}`}>
            <circle
              cx={`${homeCoord('x', i, j)}%`}
              cy={`${homeCoord('y', i, j)}%`}
              r="3%"
              className={spotCss}
            />
            <circle
              cx={`${homeCoord('x', i, j)}%`}
              cy={`${homeCoord('y', i, j)}%`}
              r="3.25%"
              className={highlightCss(i)}
            />
            <circle
              cx={`${goalCoord('x', i, j)}%`}
              cy={`${goalCoord('y', i, j)}%`}
              r="3%"
              className={spotCss}
            />
            <circle
              cx={`${goalCoord('x', i, j)}%`}
              cy={`${goalCoord('y', i, j)}%`}
              r="3.25%"
              className={highlightCss(i)}
            />
            <text
              x={`${goalCoord('x', i, j)}%`}
              y={`${goalCoord('y', i, j) + 1.5}%`}
              className={css`
                stroke: ${theme.colors[colors[i]]};
                text-anchor: middle;
              `}
            >
              {j + 1}
            </text>
          </Fragment>
        ))}
        <circle
          cx={`${playCoord('x', i * 6)}%`}
          cy={`${playCoord('y', i * 6)}%`}
          r="3.25%"
          className={highlightCss(i)}
        />
      </Fragment>
    ))}
  </svg>
);

export default GameBoard;
