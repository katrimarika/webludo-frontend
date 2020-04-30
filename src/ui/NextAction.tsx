import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';

const NextAction: FunctionalComponent = () => {
  const {
    disabled,
    animationOngoing,
    turnColor,
    game,
    actions,
  } = useGameContext();

  if (!game) {
    return null;
  }

  const nextAction =
    disabled || animationOngoing || turnColor !== game.currentColor
      ? null
      : actions.some(a => a.type === 'raise')
      ? actions.length > 1
        ? ('raise/move' as const)
        : ('raise/roll' as const)
      : !!actions.length
      ? ('move' as const)
      : ('roll' as const);

  if (!nextAction) {
    return null;
  }

  return (
    <div
      className={css`
        position: absolute;
        top: 14%;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
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
