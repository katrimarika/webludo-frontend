import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';

const positionCss = (color: Color) => {
  switch (color) {
    case 'red':
      return css`
        top: 0.5rem;
        left: -0.5rem;
        transform: rotate(-45deg);
      `;
    case 'blue':
      return css`
        top: 0.5rem;
        right: -0.5rem;
        transform: rotate(45deg);
      `;
    case 'yellow':
      return css`
        bottom: 0.5rem;
        right: -0.5rem;
        transform: rotate(-45deg);
      `;
    case 'green':
      return css`
        bottom: 0.5rem;
        left: -0.5rem;
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
        width: 3rem;
        display: flex;
        justify-content: center;
        color: ${theme.colors.boardCorner};
      `}
    >
      <div
        className={css`
          font-size: 0.875rem;
        `}
      >{`${nextAction.toUpperCase()}!`}</div>
    </div>
  );
};

export default NextAction;
