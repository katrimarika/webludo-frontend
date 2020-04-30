import { css } from 'emotion';
import { FunctionalComponent, h } from 'preact';
import { useGameContext } from '../utils/gameContext';
import { theme } from '../utils/style';
import Button from './Button';
import TeamInfo from './TeamInfo';

const TeamContainer: FunctionalComponent<{ color: Color }> = ({ color }) => {
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
  const team = teams.find(t => t.color === color);

  if (!team) {
    return null;
  }

  const isOwnTeam = !!ownColor && team && team.color === ownColor;
  const currentColor = disabled ? null : turnColor;
  const isCurrent = team.color === currentColor;
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
    <div
      className={css`
        position: relative;
        grid-column: ${color === 'red' || color === 'green' ? '1' : '3'};
        grid-row: ${color === 'red' || color === 'blue' ? '1' : '3'};
        padding: 0.25rem 0.5rem 0.375rem;
        border-radius: 0.1875rem;
        background: ${isCurrent ? theme.colors.highlight : 'transparent'};
        border: 2px solid
          ${team.color ? theme.colors[team.color].main : theme.colors.highlight};
        box-shadow: ${team.color && isOwnTeam
          ? `inset 1px 1px ${theme.colors[team.color].main}, inset -1px -1px ${
              theme.colors[team.color].main
            }`
          : 'none'};
      `}
    >
      <TeamInfo
        key={`team-${team.id}`}
        team={team}
        players={players.filter(p => p.teamId === team.id)}
        isCurrent={team.color === currentColor}
        nextAction={nextAction}
        newRaiseRound={newRaiseRound}
      />
      {isOwnTeam && (
        <div
          className={css`
            margin: 0.25rem 0 0.125rem;
            position: relative;
          `}
        >
          <Button
            color="yellow"
            extraCss={css`
              margin-right: 0.5rem;
              padding: 0.125rem 0.5rem 0.1875rem 0.6875rem;
            `}
            onClick={penaltyDone}
            disabled={!team.penalties}
            title="Own penalty done"
          >
            –🍺
          </Button>
          {newRaiseRound && (
            <Button
              color="yellow"
              extraCss={css`
                padding: 0.125rem 0.5rem 0.1875rem 0.6875rem;
              `}
              onClick={() => agreeNewRaiseRound(!team.newRaiseRound)}
              title={`Change to ${
                team.newRaiseRound ? 'disagree' : 'agree'
              } on a new raising round`}
            >
              {team.newRaiseRound ? '👎' : '👍'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamContainer;
