import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import PlayerInfo from './PlayerInfo';

const GameInfo: FunctionalComponent = () => {
  const {
    game,
    playerColor,
    disabled,
    animationOngoing,
    gameState,
    actions,
    penaltyDone,
  } = useGameContext();

  if (!game) {
    return null;
  }

  const { players } = game;
  const playerIndex = players.findIndex(p => p.color === playerColor);
  const player = playerIndex !== -1 ? players[playerIndex] : null;
  const otherPlayers = player
    ? [...players.slice(playerIndex + 1), ...players.slice(0, playerIndex)]
    : players;

  const currentColor =
    disabled || animationOngoing
      ? null
      : (gameState && gameState.currentColor) || null;
  const nextAction =
    disabled || animationOngoing
      ? null
      : actions.some(a => a.type === 'raise')
      ? actions.length > 1
        ? ('raise/move' as const)
        : ('raise/roll' as const)
      : !!actions.length
      ? ('move' as const)
      : ('roll' as const);

  return (
    <ul
      className={css`
        margin: 0;
        padding: 0;
        list-style-type: none;
      `}
    >
      {!!player && (
        <Fragment>
          <h2
            className={css`
              font-size: 1rem;
              margin: 0.5rem 0 0.25rem;
            `}
          >
            You
          </h2>
          <PlayerInfo
            key={`player-${player.color}`}
            player={player}
            isCurrent={player.color === currentColor}
            nextAction={nextAction}
            onPenaltyDone={player.penalties ? penaltyDone : undefined}
          />
          <h2
            className={css`
              font-size: 1rem;
              margin: 0.5rem 0 0.25rem;
            `}
          >
            Competitors
          </h2>
        </Fragment>
      )}
      {otherPlayers.map(p => (
        <PlayerInfo
          key={`player-${p.color}`}
          player={p}
          isCurrent={p.color === currentColor}
          nextAction={nextAction}
        />
      ))}
    </ul>
  );
};

export default GameInfo;
