import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';
import GameTitle from './GameTitle';
import MiniForm from './MiniForm';
import PlayerNames from './PlayerNames';
import Popup from './Popup';
import ScrambleTeams from './ScrambleTeams';
import StartGame from './StartGame';
import TeamSetup from './TeamSetup';

const GameSetup: FunctionalComponent = () => {
  const {
    game,
    playerId,
    ownTeam,
    joinGame,
    joinTeam,
    leaveTeam,
  } = useGameContext();

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
      <div
        className={css`
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        `}
      >
        <h2
          className={css`
            font-size: 1.25rem;
            margin: 0;
            line-height: 1;
            flex-grow: 1;
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
        <ScrambleTeams />
      </div>
      <div
        className={css`
          width: 40rem;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: min-content min-content;
          grid-gap: 0.5rem 1rem;
          margin-bottom: 1.5rem;
        `}
      >
        {game.teams.map((team, i) => (
          <TeamSetup
            key={`team-setup-${team.id}`}
            index={i + 1}
            team={team}
            players={game.players.filter(p => p.teamId === team.id)}
            highlight={!!ownTeam && ownTeam.id === team.id}
            join={
              !playerId || (ownTeam && ownTeam.id === team.id)
                ? undefined
                : () => joinTeam(team.id)
            }
          />
        ))}
      </div>
      <button
        title={!!ownTeam ? 'Join spectators (only watching)' : undefined}
        className={css`
          background: none;
          width: calc(100% + 0.5rem);
          border: 2px solid transparent;
          padding: 0.25rem 0.5rem;
          margin: -0.25rem 0 1rem -0.5rem;
          text-align: initial;
          display: flex;
          flex-direction: column;
          color: ${theme.colors.black};
          font-family: inherit;
          border-radius: 4px;
          &:not(:disabled) {
            cursor: pointer;
            &:hover,
            &:focus,
            &:active {
              border-color: ${theme.colors.blue.main};
            }
          }
        `}
        onClick={!!ownTeam ? leaveTeam : undefined}
        disabled={!ownTeam}
      >
        <div
          className={css`
            margin: 0 0 0.5rem;
            font-size: 1.25rem;
            font-weight: bold;
          `}
        >
          Spectators
        </div>
        <PlayerNames
          players={game.players.filter(p => !p.teamId)}
          wrapAlways={true}
        />
      </button>
      <StartGame />
    </Popup>
  );
};

export default GameSetup;
