import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { parseHash } from '../utils/hash';
import GamePage from './GamePage';
import LobbyPage from './LobbyPage';
import { css } from 'emotion';
import { theme } from '../utils/style';

const pageCss = css`
  background: ${theme.colors.white};
  min-height: 100vh;
  @media screen and (orientation: landscape) {
    max-width: 60rem;
    margin: 0 auto;
    padding: 0 0.8rem;
  }
  @media screen and (orientation: landscape) and (min-width: 60rem) {
    padding: 0 1.8rem;
  }
`;

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
      <div className={pageCss}>
        <GamePage code={selectedGame} />
      </div>
    );
  }

  return (
    <div className={pageCss}>
      <LobbyPage />
    </div>
  );
};

export default App;
