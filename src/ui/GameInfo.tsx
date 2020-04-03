import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import PlayerInfo from './PlayerInfo';

const GameInfo: FunctionalComponent<{
  game: Game;
  playerColor: Color | null;
  currentColor: Color | null;
  nextAction: 'roll' | 'move' | null;
}> = ({ game: { players }, playerColor, currentColor, nextAction }) => {
  const playerIndex = players.findIndex(p => p.color === playerColor);
  const player = playerIndex !== -1 ? players[playerIndex] : null;
  const otherPlayers = player
    ? [...players.slice(playerIndex + 1), ...players.slice(0, playerIndex)]
    : players;

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
