import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';
import GameTitle from './GameTitle';
import MiniForm from './MiniForm';
import PlayerNames from './PlayerNames';
import Popup from './Popup';
import StartGame from './StartGame';
import TeamSetup from './TeamSetup';

const GameSetup: FunctionalComponent = () => {
  const { game, playerId, ownTeam, joinGame, joinTeam } = useGameContext();

  if (!game) {
    return null;
  }

  return (
    <Popup>
      <GameTitle prefix="Setup: " />
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
          click a team to join
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
        <PlayerNames
          players={game.players.filter(p => !p.teamId)}
          wrapAlways={true}
        />
      </div>
      <StartGame />
    </Popup>
  );
};

export default GameSetup;
