import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameChannel } from '../utils/context';
import { theme } from '../utils/style';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';

const GamePage: FunctionalComponent<{
  code: string;
}> = ({ code }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [die, setDie] = useState<DieState>({
    roll: Math.ceil(Math.random() * 6),
    position: Math.random(),
    orientation: Math.random(),
  });
  // const error = 'ERROR';
  // const joinGame = (name: string, onSuccess: (data: Game) => void) => null;
  // const rollDie = () => null;
  const [error, joinGame, rollDie] = useGameChannel(
    code,
    game => setGame(game),
    state => setGameState(state),
    ({ roll }) =>
      setDie({ roll, position: Math.random(), orientation: Math.random() }),
  );

  const canJoin = !error && !!game && game.players.length < 4;

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        @media screen and (orientation: landscape) {
          flex-direction: row;
        }
      `}
    >
      <div
        className={css`
          padding: 1.2rem;
        `}
      >
        <h1
          className={css`
            font-size: 1.5rem;
            margin: 0 0 0.8rem;
          `}
        >
          {game && game.name ? (
            <span>{game.name}</span>
          ) : (
            <span
              className={css`
                color: ${theme.colors.gray};
              `}
            >
              {'<No name>'}
            </span>
          )}
          <span
            className={css`
              font-size: 1rem;
              color: ${theme.colors.gray};
            `}
          >{` ${code}`}</span>
        </h1>
        <ErrorMessage
          prefix="Error: "
          text={error}
          styles={css`
            margin-bottom: 0.6rem;
          `}
        />
        {game && (
          <GameInfo
            game={game}
            currentColor={(gameState && gameState.currentColor) || null}
          />
        )}
        {canJoin && (
          <MiniForm
            inputName="player-name"
            label="Name"
            buttonText="Join"
            buttonColor="green"
            onSubmit={name => joinGame(name, data => setGame(data))}
          />
        )}
      </div>
      <div
        className={css`
          margin: 0 auto;
        `}
      >
        <Game
          gameState={gameState}
          die={die}
          onRoll={rollDie}
          disabled={!game || game.status !== 'ongoing' || !!error}
        />
      </div>
    </div>
  );
};

export default GamePage;
