import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { pulseAnimation, theme } from '../utils/style';

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
        <Fragment>
          <div
            className={css`
              font-size: 0.8rem;
              text-transform: uppercase;
              margin-bottom: 0.4rem;
            `}
          >
            {status}
          </div>
          <ul
            className={css`
              margin: 0;
              padding: 0;
              list-style-type: none;
            `}
          >
            {players.map(p => (
              <li
                key={`player-${p.name}`}
                className={css`
                  display: flex;
                  align-items: center;
                  line-height: 1.4;
                `}
              >
                <div
                  className={css`
                    flex: 0 0 0.6rem;
                    background: ${theme.colors[p.color].main};
                    height: 0.6rem;
                    width: 0.6rem;
                    border-radius: 0.6rem;
                    margin-right: 0.4rem;
                    animation: ${p.color === currentColor
                      ? `${pulseAnimation} 1s alternate infinite`
                      : 'none'};
                  `}
                />
                <div>{`${p.name}${
                  status === 'ongoing' && p.color === currentColor
                    ? ' PLAY!'
                    : ''
                }`}</div>
              </li>
            ))}
          </ul>
        </Fragment>
      );
    default:
      return null;
  }
};

export default GameInfo;
