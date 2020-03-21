import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import {
  arrowCoord,
  colors,
  goalCoord,
  homeCoord,
  playCoord,
} from '../utils/helpers';
import { theme } from '../utils/style';

const spotCss = css`
  stroke: black;
  stroke-width: 0.1rem;
  fill: transparent;
`;
const highlightCss = (i: number) => css`
  stroke-width: 0.15rem;
  stroke: ${theme.colors[colors[i]].main};
  fill: transparent;
`;
const bd1 = 180; // board cut-corner distance
const bd2 = 998 - bd1;
const cd1 = 105; // center cut-corner start distance
const cd2 = 145; // center cut-corner end distance

const GameBoard: FunctionalComponent = () => (
  <svg width="100%" height="100%">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000">
      <polygon
        points={`${bd1},2 ${bd2},2 998,${bd1} 998,${bd2} ${bd2},998 ${bd1},998 2,${bd2} 2,${bd1}`}
        className={spotCss}
      />
    </svg>
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
            <svg
              x={`${homeCoord('x', i, j) - 2}%`}
              y={`${homeCoord('y', i, j) - 2}%`}
              width="4%"
              height="4%"
              viewBox="0 0 100 100"
            >
              <polygon
                points="2,50 50,15, 98,50 80,50 80,80 20,80 20,50"
                className={css`
                  fill: ${theme.colors[colors[i]].main};
                `}
              />
            </svg>
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
                fill: ${theme.colors[colors[i]].text};
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
        <text
          x={`${playCoord('x', i * 6)}%`}
          y={`${playCoord('y', i * 6) + 0.6}%`}
          className={css`
            fill: ${theme.colors[colors[i]].text};
            font-size: 0.45rem;
            text-anchor: middle;
          `}
        >
          Start
        </text>
        <svg
          x={`${arrowCoord('x', i)}%`}
          y={`${arrowCoord('y', i)}%`}
          width="10%"
          height="10%"
          viewBox="0 0 100 100"
        >
          <path
            d="M10,80 Q35,25 75,65 L71,70 80,71 79,61.5 75,65"
            transform={`rotate(${90 * i} 50 50)`}
            className={css`
              stroke-width: 0.4rem;
              stroke: ${theme.colors[colors[i]].main};
              fill: transparent;
            `}
          />
        </svg>
      </Fragment>
    ))}
    <circle cx="50%" cy="50%" r="10%" className={spotCss} />
    <circle cx="50%" cy="50%" r="9%" className={spotCss} />
    <svg x="35%" y="35%" width="30%" height="30%" viewBox="0 0 250 250">
      <polygon
        points={`${cd1},2 ${cd2},2 248,${cd1} 248,${cd2} ${cd2},248 ${cd1},248 2,${cd2} 2,${cd1}`}
        className={spotCss}
      />
    </svg>
  </svg>
);

export default GameBoard;
