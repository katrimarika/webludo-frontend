import { css } from 'emotion';
import { FunctionalComponent, h, Fragment } from 'preact';
import { dieCoord } from '../utils/helpers';
import { theme } from '../utils/style';
import Pip from './Pip';

const Die: FunctionalComponent<DieState> = ({
  roll,
  position,
  distance,
  orientation,
}) => {
  const renderCoords = [
    dieCoord('x', position, distance) * 10,
    dieCoord('y', position, distance) * 10,
  ];
  return (
    <g
      className={css`
        transform: translate(-30px, -30px) rotate(${360 * orientation}deg);
        transform-origin: ${renderCoords[0] + 30}px ${renderCoords[1] + 30}px;
      `}
    >
      <svg
        x={renderCoords[0]}
        y={renderCoords[1]}
        width="60"
        height="60"
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
            stroke-width: 5;
            fill: ${theme.colors.ivory};
          `}
        />
        {roll % 2 === 1 && <Pip x={50} y={50} />}
        {(roll === 3 || roll === 5) && (
          <Fragment>
            <Pip x={72} y={28} />
            <Pip x={28} y={72} />
          </Fragment>
        )}
        {roll === 5 && (
          <Fragment>
            <Pip x={28} y={28} />
            <Pip x={72} y={72} />
          </Fragment>
        )}
        {(roll === 2 || roll === 4) && (
          <Fragment>
            <Pip x={69} y={31} />
            <Pip x={31} y={69} />
          </Fragment>
        )}
        {roll === 4 && (
          <Fragment>
            <Pip x={31} y={31} />
            <Pip x={69} y={69} />
          </Fragment>
        )}
        {roll === 6 && (
          <Fragment>
            <Pip x={50} y={33} />
            <Pip x={50} y={67} />
            <Pip x={25} y={33} />
            <Pip x={25} y={67} />
            <Pip x={75} y={33} />
            <Pip x={75} y={66} />
          </Fragment>
        )}
      </svg>
    </g>
  );
};

export default Die;
