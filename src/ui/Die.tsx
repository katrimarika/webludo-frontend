import { css } from 'emotion';
import { FunctionalComponent, h, Fragment } from 'preact';
import { theme } from '../utils/style';
import { dieCoord } from '../utils/helpers';

const pipAttrs = {
  r: 10,
  className: css`
    fill: ${theme.colors.black};
  `,
};

const Die: FunctionalComponent<DieState> = ({
  roll,
  position,
  orientation,
}) => (
  <svg width="100%" height="100%" viewBox="0 0 500 500">
    <g transform={`rotate(${180 * orientation} 250 250)`}>
      <svg
        x={`${dieCoord('x', position)}%`}
        y={`${dieCoord('y', position)}%`}
        width="6%"
        height="6%"
        viewBox="0 0 100 100"
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="20"
          className={css`
            stroke: ${theme.colors.black};
            stroke-width: 0.2rem;
            fill: ${theme.colors.ivory};
          `}
        />
        {roll % 2 === 1 && <circle cx="50" cy="50" {...pipAttrs} />}
        {(roll === 3 || roll === 5) && (
          <Fragment>
            <circle cx="72" cy="28" {...pipAttrs} />
            <circle cx="28" cy="72" {...pipAttrs} />
            {roll === 5 && (
              <Fragment>
                <circle cx="28" cy="28" {...pipAttrs} />
                <circle cx="72" cy="72" {...pipAttrs} />
              </Fragment>
            )}
          </Fragment>
        )}
        {(roll === 2 || roll === 4) && (
          <Fragment>
            <circle cx="69" cy="31" {...pipAttrs} />
            <circle cx="31" cy="69" {...pipAttrs} />
            {roll === 4 && (
              <Fragment>
                <circle cx="31" cy="31" {...pipAttrs} />
                <circle cx="69" cy="69" {...pipAttrs} />
              </Fragment>
            )}
          </Fragment>
        )}
        {roll === 6 && (
          <Fragment>
            <circle cx="50" cy="33" {...pipAttrs} />
            <circle cx="50" cy="67" {...pipAttrs} />
            <circle cx="25" cy="33" {...pipAttrs} />
            <circle cx="25" cy="67" {...pipAttrs} />
            <circle cx="75" cy="33" {...pipAttrs} />
            <circle cx="75" cy="66" {...pipAttrs} />
          </Fragment>
        )}
      </svg>
    </g>
  </svg>
);

export default Die;
