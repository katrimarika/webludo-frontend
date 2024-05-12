import { css } from '@emotion/css';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';

const positionCss = (color: Color) => {
  switch (color) {
    case 'red':
      return css`
        top: 0;
        left: 0;
        transform: rotate(-45deg);
      `;
    case 'blue':
      return css`
        top: 0;
        right: 0;
        transform: rotate(45deg);
      `;
    case 'yellow':
      return css`
        bottom: 0;
        right: 0;
        transform: rotate(-45deg);
      `;
    case 'green':
      return css`
        bottom: 0;
        left: 0;
        transform: rotate(45deg);
      `;
    default:
      return undefined;
  }
};

const NextAction: FunctionalComponent = () => {
  const {
    disabled,
    animationOngoing,
    turnColor,
    game,
    actions,
  } = useGameContext();

  if (
    !game ||
    disabled ||
    animationOngoing ||
    !turnColor ||
    turnColor !== game.currentColor
  ) {
    return null;
  }

  const nextAction = actions.some(a => a.type === 'raise')
    ? ('raise' as const)
    : !!actions.length
    ? ('move' as const)
    : ('roll' as const);

  return (
    <div
      className={css`
        position: absolute;
        ${positionCss(turnColor)}
        color: ${theme.colors.boardCorner};
        width: 15%;
        height: 15%;
        pointer-events: none;
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={css`
          width: 100%;
          height: 100%;
          display: block;
        `}
        viewBox="0 0 100 100"
      >
        <text
          x={50}
          y={turnColor === 'yellow' || turnColor === 'green' ? 90 : 28}
          className={css`
            fill: ${theme.colors.black};
            font-size: 25px;
            letter-spacing: 1px;
            text-anchor: middle;
            pointer-events: none;
            user-select: none;
          `}
        >{`${nextAction.toUpperCase()}!`}</text>
      </svg>
    </div>
  );
};

export default NextAction;
