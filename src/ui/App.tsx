import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GameProvider } from '../utils/gameContext';
import { parseHash } from '../utils/hash';
import GamePage from './GamePage';
import LobbyPage from './LobbyPage';

const App: FunctionalComponent = () => {
  const [selectedGame, setSelectedGame] = useState(parseHash());

  useEffect(() => {
    const listener = () => {
      setSelectedGame(parseHash());
    };
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);

  if (selectedGame) {
    return (
      <GameProvider code={selectedGame}>
        <GamePage />
      </GameProvider>
    );
  }

  return <LobbyPage />;
};

export default App;
