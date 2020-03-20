import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Socket } from '../utils/socket';
import Game from './Game';
import GameInfo from './GameInfo';

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

  return (
    <div>
      <h1
        className={css`
          padding: 0 1.2rem;
        `}
      >
        <span
          className={css`
            margin-right: 0.6rem;
          `}
        >
          Game: {id}
        </span>
        <button type="button" onClick={loadGame}>
          Reload
        </button>
      </h1>
      <div
        className={css`
          @media screen and (orientation: landscape) {
            display: flex;
          }
        `}
      >
        <div
          className={css`
            margin-bottom: 1.2rem;
            padding: 0 1.2rem;
          `}
        >
          <GameInfo
            gameData={gameData}
            currentColor={
              (gameState.status === 'SUCCESS' && gameState.data.currentColor) ||
              null
            }
          />
        </div>
        <Game gameState={gameState} />
      </div>
    </div>
  );
};

export default GamePage;
