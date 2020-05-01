import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';
import GameTitle from './GameTitle';
import MiniForm from './MiniForm';
import Popup from './Popup';
import TeamSetup from './TeamSetup';

const GameSetup: FunctionalComponent = () => {
  const { game, playerId, ownTeam, joinGame, joinTeam } = useGameContext();

  if (!game) {
    return null;
  }

  return (
    <Popup>
      <GameTitle />
      {!playerId && (
        <MiniForm
          inputName="player-name"
          title="Join game"
          label="Name"
          buttonText="Join"
          placeholder="Enter a name to join"
          buttonColor="green"
          onSubmit={name => joinGame(name)}
        />
      )}
      <h2
        className={css`
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        `}
      >
        <span>{`Teams `}</span>
        <span
          className={css`
            font-size: 1rem;
            font-weight: normal;
            color: ${theme.colors.gray};
          `}
        >
          click to join
        </span>
      </h2>
      <div
        className={css`
          width: 40rem;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: min-content min-content;
          grid-gap: 1rem 1.5rem;
          margin-bottom: 1.5rem;
        `}
      >
        {game.teams.map((team, i) => (
          <TeamSetup
            key={`team-setup-${team.id}`}
            index={i + 1}
            team={team}
            playerId={playerId}
            players={game.players.filter(p => p.teamId === team.id)}
            join={
              ownTeam && ownTeam.id === team.id
                ? undefined
                : () => joinTeam(team.id)
            }
          />
        ))}
      </div>
      <h2
        className={css`
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        `}
      >
        Spectators
      </h2>
      <div
        className={css`
          margin-bottom: 1.5rem;
        `}
      >
        {game.players
          .filter(p => !p.teamId)
          .map(p => (
            <div
              key={`setup-spectator-${p.id}`}
              className={css`
                line-height: 1.2;
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
                font-weight: ${p.id === playerId ? 'bold' : 'normal'};
              `}
            >
              {p.name}
            </div>
          ))}
      </div>
    </Popup>
  );
};

export default GameSetup;
