import { css } from 'emotion';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import TeamInfo from './TeamInfo';

const GameInfo: FunctionalComponent = () => {
  const {
    game,
    ownColor,
    disabled,
    animationOngoing,
    actions,
    penaltyDone,
    agreeNewRaiseRound,
    turnColor,
  } = useGameContext();

  if (!game) {
    return null;
  }

  const { players, teams, newRaiseRound } = game;
  const teamIndex = !ownColor ? -1 : teams.findIndex(t => t.color === ownColor);
  const team = teamIndex !== -1 ? teams[teamIndex] : null;
  const otherTeams = team
    ? [...teams.slice(teamIndex + 1), ...teams.slice(0, teamIndex)]
    : teams;

  const currentColor = disabled ? null : turnColor;
  const nextAction =
    disabled || animationOngoing || turnColor !== game.currentColor
      ? null
      : actions.some(a => a.type === 'raise')
      ? actions.length > 1
        ? ('raise/move' as const)
        : ('raise/roll' as const)
      : !!actions.length
      ? ('move' as const)
      : ('roll' as const);

  return (
    <ul
      className={css`
        margin: 0;
        padding: 0;
        list-style-type: none;
      `}
    >
      {!!team && (
        <Fragment>
          <h2
            className={css`
              font-size: 1rem;
              margin: 0.5rem 0 0.25rem;
            `}
          >
            Your team
          </h2>
          <TeamInfo
            key={`team-${team.id}`}
            team={team}
            players={players.filter(p => p.teamId === team.id)}
            isCurrent={team.color === currentColor}
            nextAction={nextAction}
            newRaiseRound={newRaiseRound}
            onPenaltyDone={team.penalties ? penaltyDone : undefined}
            onToggleAgree={() => agreeNewRaiseRound(!team.newRaiseRound)}
          />
        </Fragment>
      )}
      {otherTeams.length && (
        <h2
          className={css`
            font-size: 1rem;
            margin: 0.5rem 0 0.25rem;
          `}
        >
          Competitors
        </h2>
      )}
      {otherTeams.map(t => (
        <TeamInfo
          key={`team-${t.id}`}
          team={t}
          players={players.filter(p => p.teamId === t.id)}
          isCurrent={t.color === currentColor}
          nextAction={nextAction}
          newRaiseRound={newRaiseRound}
        />
      ))}
      <h2
        className={css`
          font-size: 1rem;
          margin: 0.75rem 0 0.25rem;
        `}
      >
        Spectators
      </h2>
      <div
        className={css`
          padding: 0.25rem 0;
          line-height: 1.33;
          font-size: 0.875rem;
        `}
      >
        {players
          .filter(p => !p.teamId)
          .map(p => p.name)
          .join(' • ')}
      </div>
    </ul>
  );
};

export default GameInfo;
