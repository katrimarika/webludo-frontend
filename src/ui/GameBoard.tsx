import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { goalCoord, homeCoord, playCoord } from '../utils/helpers';

const spotCss = css`
  stroke: black;
  stroke-width: 0.1rem;
  fill: white;
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
    {[...new Array(4)].map((_, i) =>
      [...new Array(4)].map((_, j) => (
        <Fragment key={`other-${i}-${j}`}>
          <circle
            cx={`${homeCoord('x', i, j)}%`}
            cy={`${homeCoord('y', i, j)}%`}
            r="3%"
            className={spotCss}
          />
          <circle
            cx={`${goalCoord('x', i, j)}%`}
            cy={`${goalCoord('y', i, j)}%`}
            r="3%"
            className={spotCss}
          />
        </Fragment>
      )),
    )}
  </svg>
);

export default GameBoard;
