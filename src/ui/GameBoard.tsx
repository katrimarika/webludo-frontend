import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { memo } from 'preact/compat';
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
  fill: ${theme.colors.white};
`;
const highlightCss = (i: number) => css`
  stroke-width: 0.15rem;
  stroke: ${theme.colors[colors[i]].main};
  fill: transparent;
`;
const backgroundLineCss = css`
  stroke-width: 5rem;
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
  <svg width="100%" height="100%">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000">
      <path
        d={`M${bd1},2 ${bd2},2 Q944,56 998,${bd1} L998,${bd2} Q944,944 ${bd2},998 L${bd1},998 Q56,944 2,${bd2} L2,${bd1} Q56,56 ${bd1},2`}
        className={css`
          stroke: black;
          stroke-width: 0.2rem;
          fill: ${theme.colors.boardCorner};
        `}
      />
      <path
        d={`M${bid1},5 ${bid2},5 Q924,76 995,${bid1} L995,${bid2} Q924,924 ${bid2},995 L${bid1},995 Q76,924 5,${bid2} L5,${bid1} Q76,76 ${bid1},5`}
        className={css`
          stroke: black;
          stroke-width: 0.2rem;
          fill: ${theme.colors.white};
        `}
      />
    </svg>
    <circle
      cx="50%"
      cy="50%"
      r="44.5%"
      className={css`
        fill: ${theme.colors.boardCenter};
      `}
    />
    <svg width="100%" height="100%" viewBox="0 0 1000 1000">
      <path d="M250,250 Q195,172 260,125" className={backgroundLineCss} />
      <path d="M250,250 Q172,195 125,260" className={backgroundLineCss} />
      <path d="M750,750 Q805,828 740,875" className={backgroundLineCss} />
      <path d="M750,750 Q828,805 875,740" className={backgroundLineCss} />
      <path d="M750,250 Q805,172 740,125" className={backgroundLineCss} />
      <path d="M750,250 Q828,195 875,260" className={backgroundLineCss} />
      <path d="M250,750 Q195,828 260,875" className={backgroundLineCss} />
      <path d="M250,750 Q172,805 125,740" className={backgroundLineCss} />
    </svg>
    <line
      x1="16%"
      y1="16%"
      x2="84%"
      y2="84%"
      className={css`
        stroke: ${theme.colors.boardPath};
        stroke-width: 2.3rem;
        fill: transparent;
      `}
    />
    <line
      x1="16%"
      y1="84%"
      x2="84%"
      y2="16%"
      className={css`
        stroke: ${theme.colors.boardPath};
        stroke-width: 2.3rem;
        fill: transparent;
      `}
    />
    <circle
      cx="50%"
      cy="50%"
      r="44.5%"
      className={css`
        stroke: ${theme.colors.boardPath};
        stroke-width: 2.1rem;
        fill: transparent;
      `}
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
              stroke-width: 0.5rem;
              stroke: ${theme.colors[colors[i]].main};
              fill: transparent;
            `}
          />
        </svg>
      </Fragment>
    ))}
    <svg x="35%" y="35%" width="30%" height="30%" viewBox="0 0 250 250">
      <polygon
        points={`${cd1},2 ${cd2},2 248,${cd1} 248,${cd2} ${cd2},248 ${cd1},248 2,${cd2} 2,${cd1}`}
        className={css`
          stroke: black;
          stroke-width: 0.1rem;
          fill: ${theme.colors.lightgray};
        `}
      />
    </svg>
  </svg>
);

export default memo(GameBoard);
