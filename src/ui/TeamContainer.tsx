import { css } from '@emotion/css';
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

  return (
    <div
      className={css`
        grid-column: ${color === 'red' || color === 'green' ? '1' : '3'};
        grid-row: ${color === 'red' || color === 'blue' ? '1' : '3'};
        padding: 0.25rem 0.375rem 0.375rem;
        border-radius: 0.1875rem;
        background: ${isCurrent
          ? team.color
            ? theme.colors[team.color].light
            : theme.colors.highlight
          : 'transparent'};
        border: 2px solid
          ${team.color ? theme.colors[team.color].main : theme.colors.highlight};
        box-shadow: ${team.color && isOwnTeam
          ? `inset 2px 2px ${theme.colors[team.color].main}, inset -2px -2px ${
              theme.colors[team.color].main
            }`
          : 'none'};
      `}
    >
      <TeamInfo
        team={team}
        players={players.filter(p => p.teamId === team.id)}
        newRaiseRound={newRaiseRound}
      />
      {isOwnTeam && (
        <div
          className={css`
            margin: 0.25rem 0 0.125rem;
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
            title="Team penalty complete"
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
