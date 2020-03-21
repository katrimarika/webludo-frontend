import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Channel, SocketHandler } from '../utils/socket';
import ErrorMessage from './ErrorMessage';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';

const GamePage: FunctionalComponent<{ id: string; socket: SocketHandler }> = ({
  id,
  socket,
}) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (socket && !channel) {
      const gameChannel = socket.joinGameChannel(
        id,
        data => {
          setGame(data.game);
          setGameState(data.state);
        },
        e => {
          setChannel(null);
          setError(JSON.stringify(e, null, 2));
        },
      );
      setChannel(gameChannel);
      return () => socket.leaveChannel(gameChannel);
    }
  }, []);

  const canJoin = socket && channel && !!game && game.players.length < 4;

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
            display: flex;
            align-items: center;
            margin: 0 0 0.8rem;
          `}
        >
          <span
            className={css`
              margin-right: 0.8rem;
            `}
          >
            Game: {id}
          </span>
        </h1>
        <ErrorMessage
          prefix={error ? 'Channel error: ' : ''}
          text={error || (!game ? 'No game data :(' : '')}
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
            name="player-name"
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
      <Game
        gameState={gameState}
        disabled={!game || game.status !== 'ongoing' || !!error}
      />
    </div>
  );
};

export default GamePage;
