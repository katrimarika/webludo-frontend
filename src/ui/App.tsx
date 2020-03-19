import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { parseHash } from '../utils/hash';
import { initSocket } from '../utils/socket';
import GamePage from './GamePage';
import LobbyPage from './LobbyPage';

const App: FunctionalComponent = () => {
  const [socket] = useState(initSocket());
  const [selectedGame, setSelectedGame] = useState(parseHash());

  useEffect(() => {
    const listener = () => {
      setSelectedGame(parseHash());
    };
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);

  if (selectedGame) {
    return <GamePage id={selectedGame} socket={socket} />;
  }

  return <LobbyPage socket={socket} />;
};

export default App;
