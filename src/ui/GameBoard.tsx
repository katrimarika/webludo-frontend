import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
import { arrowCoord, goalCoord, homeCoord, playCoord } from '../utils/helpers';
import { theme } from '../utils/style';
import { colors } from '../utils/validation';

const spotCss = css`
  stroke: black;
  stroke-width: 4;
  fill: ${theme.colors.white};
`;
const highlightCss = (i: number) => css`
  stroke-width: 6;
  stroke: ${theme.colors[colors[i]].main};
  fill: transparent;
`;
const backgroundLineCss = css`
  stroke-width: 92;
  stroke: ${theme.colors.boardPath};
  fill: transparent;
  stroke-linecap: round;
`;
const bd1 = 160; // board cut-corner distance
const bd2 = 998 - bd1;
const bid1 = 220; // board inner cut-corner distance
const bid2 = 995 - bid1;
const cd1 = 105; // center cut-corner start distance
const cd2 = 145; // center cut-corner end distance

const GameBoard: FunctionalComponent = () => (
  <g>
    <path
      d={`M${bd1},2 ${bd2},2 Q944,56 998,${bd1} L998,${bd2} Q944,944 ${bd2},998 L${bd1},998 Q56,944 2,${bd2} L2,${bd1} Q56,56 ${bd1},2`}
      className={css`
        stroke: black;
        stroke-width: 4;
        fill: ${theme.colors.boardCorner};
      `}
    />
    <path
      d={`M${bid1},5 ${bid2},5 Q924,76 995,${bid1} L995,${bid2} Q924,924 ${bid2},995 L${bid1},995 Q76,924 5,${bid2} L5,${bid1} Q76,76 ${bid1},5`}
      className={css`
        stroke: black;
        stroke-width: 4;
        fill: ${theme.colors.white};
      `}
    />
    <circle
      cx="500"
      cy="500"
      r="445"
      className={css`
        fill: ${theme.colors.boardCenter};
      `}
    />
    <path d="M250,250 Q195,172 260,125" className={backgroundLineCss} />
    <path d="M250,250 Q172,195 125,260" className={backgroundLineCss} />
    <path d="M750,750 Q805,828 740,875" className={backgroundLineCss} />
    <path d="M750,750 Q828,805 875,740" className={backgroundLineCss} />
    <path d="M750,250 Q805,172 740,125" className={backgroundLineCss} />
    <path d="M750,250 Q828,195 875,260" className={backgroundLineCss} />
    <path d="M250,750 Q195,828 260,875" className={backgroundLineCss} />
    <path d="M250,750 Q172,805 125,740" className={backgroundLineCss} />
    <line
      x1="160"
      y1="160"
      x2="840"
      y2="840"
      className={css`
        stroke: ${theme.colors.boardPath};
        stroke-width: 110;
        fill: transparent;
      `}
    />
    <line
      x1="160"
      y1="840"
      x2="840"
      y2="160"
      className={css`
        stroke: ${theme.colors.boardPath};
        stroke-width: 110;
        fill: transparent;
      `}
    />
    <circle
      cx="500"
      cy="500"
      r="445"
      className={css`
        stroke: ${theme.colors.boardPath};
        stroke-width: 95;
        fill: transparent;
      `}
    />
    {[...new Array(28)].map((_, i) => (
      <circle
        key={`play-${i}`}
        cx={`${playCoord('x', i) * 10}`}
        cy={`${playCoord('y', i) * 10}`}
        r="30"
        className={spotCss}
      />
    ))}
    {[...new Array(4)].map((_, i) => (
      <Fragment key={`other-${i}`}>
        {[...new Array(4)].map((_, j) => (
          <Fragment key={`other-${i}-${j}`}>
            <circle
              cx={`${homeCoord('x', i, j) * 10}`}
              cy={`${homeCoord('y', i, j) * 10}`}
              r="30"
              className={spotCss}
            />
            <circle
              cx={`${homeCoord('x', i, j) * 10}`}
              cy={`${homeCoord('y', i, j) * 10}`}
              r="32.5"
              className={highlightCss(i)}
            />
            <svg
              x={`${(homeCoord('x', i, j) - 2) * 10}`}
              y={`${(homeCoord('y', i, j) - 2) * 10}`}
              width="40"
              height="40"
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
              cx={`${goalCoord('x', i, j) * 10}`}
              cy={`${goalCoord('y', i, j) * 10}`}
              r="30"
              className={spotCss}
            />
            <circle
              cx={`${goalCoord('x', i, j) * 10}`}
              cy={`${goalCoord('y', i, j) * 10}`}
              r="32.5"
              className={highlightCss(i)}
            />
            <text
              x={`${goalCoord('x', i, j) * 10}`}
              y={`${(goalCoord('y', i, j) + 1.5) * 10}`}
              className={css`
                fill: ${theme.colors[colors[i]].text};
                text-anchor: middle;
                font-size: 44px;
              `}
            >
              {j + 1}
            </text>
          </Fragment>
        ))}
        <circle
          cx={`${playCoord('x', i * 7) * 10}`}
          cy={`${playCoord('y', i * 7) * 10}`}
          r="32.5"
          className={highlightCss(i)}
        />
        <text
          x={`${playCoord('x', i * 7) * 10}`}
          y={`${(playCoord('y', i * 7) + 0.65) * 10}`}
          className={css`
            fill: ${theme.colors[colors[i]].text};
            font-size: 22.5px;
            text-anchor: middle;
          `}
        >
          Start
        </text>
        <svg
          x={`${arrowCoord('x', i) * 10}`}
          y={`${arrowCoord('y', i) * 10}`}
          width="100"
          height="100"
          viewBox="0 0 100 100"
        >
          <path
            d="M10,80 Q35,25 75,65 L71,70 80,71 79,61.5 75,65"
            transform={`rotate(${90 * i} 50 50)`}
            className={css`
              stroke-width: 13;
              stroke: ${theme.colors[colors[i]].main};
              fill: transparent;
            `}
          />
        </svg>
      </Fragment>
    ))}
    <svg x="350" y="350" width="300" height="300" viewBox="0 0 250 250">
      <polygon
        points={`${cd1},2 ${cd2},2 248,${cd1} 248,${cd2} ${cd2},248 ${cd1},248 2,${cd2} 2,${cd1}`}
        className={css`
          stroke: black;
          stroke-width: 3;
          fill: ${theme.colors.lightgray};
        `}
      />
    </svg>
  </g>
);

export default memo(GameBoard);
