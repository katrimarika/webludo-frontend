import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GameProvider } from '../utils/gameContext';
import { parseHash } from '../utils/hash';
import GamePage from './GamePage';
import LobbyPage from './LobbyPage';
import SharePopup from './SharePopup';

const App: FunctionalComponent = () => {
  const [selectedGame, setSelectedGame] = useState(parseHash());
  const [showSharePopup, setShowSharePopup] = useState(false);

  useEffect(() => {
    const listener = () => {
      setSelectedGame(parseHash());
    };
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);

  if (selectedGame) {
    return (
      <Fragment key={selectedGame}>
        <GameProvider code={selectedGame}>
          <GamePage openSharePopup={() => setShowSharePopup(true)} />
        </GameProvider>
        {showSharePopup && (
          <SharePopup close={() => setShowSharePopup(false)} />
        )}
      </Fragment>
    );
  }

  return <LobbyPage onCreateGame={() => setShowSharePopup(true)} />;
};

export default App;
