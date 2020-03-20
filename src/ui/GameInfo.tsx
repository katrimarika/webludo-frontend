import { FunctionalComponent, h } from 'preact';

const GameInfo: FunctionalComponent<{
  gameData: RemoteData<Game>;
  currentColor: Color | null;
}> = ({ gameData, currentColor }) => {
  switch (gameData.status) {
    case 'NOT_ASKED':
      return <div>No game details!</div>;
    case 'ASKED':
      return <div>Loading game details...</div>;
    case 'ERROR':
      return <div>Error: {gameData.error}</div>;
    case 'SUCCESS':
      const { players, status } = gameData.data;
      return (
        <div>
          <ol>
            {players.map(p => (
              <li key={`player-${p.name}`}>{`${p.name} (${p.color})${
                status === 'ongoing' && p.color === currentColor ? ' PLAY!' : ''
              }`}</li>
            ))}
          </ol>
          <div>status: {status}</div>
        </div>
      );
    default:
      return null;
  }
};

export default GameInfo;
