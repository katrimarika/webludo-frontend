import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { SocketActions } from '../utils/socket';

type Game = {
  id: string;
  players: string[];
};

const GamePage: FunctionalComponent<{ id: string; socket: SocketActions }> = ({
  id,
  socket,
}) => {
  const [gameData, setGameData] = useState<Game | null>(null);

  useEffect(() => {
    socket.getGame(id, data => {
      setGameData(data);
    });
    socket.registerHandler((message, data) => {
      if (message === 'gameData') {
        setGameData(data);
      }
    });
  }, []);

  return (
    <div>
      <h1>Game: {id}</h1>
      {!gameData ? (
        <div>No data</div>
      ) : (
        <ol>
          {gameData.players.map(p => (
            <li key={`player-${p}`}>{p}</li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default GamePage;
