import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Socket } from '../utils/socket';
import { buttonCss } from '../utils/style';
import Game from './Game';
import GameInfo from './GameInfo';
import MiniForm from './MiniForm';

const GamePage: FunctionalComponent<{ id: string; socket: Socket }> = ({
  id,
  socket,
}) => {
  const [gameData, setGameData] = useState<RemoteData<Game>>({
    status: 'NOT_ASKED',
  });
  const [gameState, setGameState] = useState<RemoteData<GameState>>({
    status: 'NOT_ASKED',
  });

  const loadGame = () => {
    if (socket) {
      setGameData({ status: 'ASKED' });
      setGameState({ status: 'ASKED' });
      socket.getGame(id);
      socket.getGameState(id);
    } else {
      setGameData({ status: 'ERROR', error: 'No connection' });
      setGameState({ status: 'ERROR', error: 'No connection' });
    }
  };

  useEffect(() => {
    loadGame();
    if (socket) {
      socket.registerHandler((message, data) => {
        if (message === 'gameData') {
          setGameData(data);
        } else if (message === 'state') {
          setGameState(data);
        }
      });
      socket.onError(() => {
        setGameData({ status: 'ERROR', error: 'Connection error' });
        setGameState({ status: 'ERROR', error: 'Connection error' });
      });
      return socket.unregisterHandler();
    }
  }, []);

  const canJoin =
    gameData.status === 'SUCCESS' && gameData.data.players.length < 4;

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
          <button type="button" onClick={loadGame} className={buttonCss()}>
            Reload
          </button>
        </h1>
        <GameInfo
          gameData={gameData}
          currentColor={
            (gameState.status === 'SUCCESS' && gameState.data.currentColor) ||
            null
          }
        />
        {canJoin && (
          <MiniForm
            name="player-name"
            label="Name"
            buttonText="Join"
            buttonColor="green"
            onSubmit={name => {
              if (socket) {
                socket.join(id, name);
              }
            }}
          />
        )}
      </div>
      <Game gameState={gameState} />
    </div>
  );
};

export default GamePage;
