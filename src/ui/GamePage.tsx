import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Channel, SocketHandler } from '../utils/socket';
import { theme } from '../utils/style';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';

const GamePage: FunctionalComponent<{
  code: string;
  socket: SocketHandler;
}> = ({ code, socket }) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameError, setGameError] = useState('');
  const [die, setDie] = useState<DieState>({
    roll: Math.ceil(Math.random() * 6),
    position: Math.random(),
    orientation: Math.random(),
  });

  useEffect(() => {
    if (socket && !channel) {
      const gameChannel = socket.joinGameChannel(
        code,
        game => setGame(game),
        state => setGameState(state),
        roll =>
          setDie({ roll, position: Math.random(), orientation: Math.random() }),
        e => setError(e),
      );
      setChannel(gameChannel);
      return () => socket.leaveChannel(gameChannel);
    }
  }, []);

  const canJoin =
    socket && channel && !error && !!game && game.players.length < 4;

  return (
    <div
      className={css`
        @media screen and (orientation: landscape) {
          display: flex;
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
            onSubmit={name => {
              if (socket && channel) {
                socket.joinGame(
                  channel,
                  name,
                  data => setGame(data),
                  e => setError(e),
                );
              }
            }}
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
          onRoll={() => {
            if (socket && channel) {
              socket.rollDie(
                channel,
                v =>
                  setDie({
                    roll: v.roll,
                    position: Math.random(),
                    orientation: Math.random(),
                  }),
                e => setGameError(e),
              );
            }
          }}
          disabled={!game || game.status !== 'ongoing' || !!error}
          message={gameError}
        />
      </div>
    </div>
  );
};

export default GamePage;
