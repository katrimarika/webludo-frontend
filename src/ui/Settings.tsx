import { css } from '@emotion/css';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameContext } from '../utils/gameContext';
import Button from './Button';
import MiniForm from './MiniForm';
import Popup from './Popup';

const Settings: FunctionalComponent<{
  extraCss?: string;
}> = ({ extraCss }) => {
  const { game, ownColor, fixPenalty } = useGameContext();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!ownColor || !game) {
    // If nothing can be done, do not show settings at all
    return null;
  }

  const team = game.teams.find(p => p.color === ownColor);

  return (
    <Fragment>
      <Button
        color="green"
        extraCss={extraCss}
        onClick={() => setSettingsOpen(true)}
      >
        Settings
      </Button>
      {settingsOpen && (
        <Popup close={() => setSettingsOpen(false)}>
          <h2
            className={css`
              font-size: 1.25rem;
              margin: 0 0 1rem;
            `}
          >
            Settings
          </h2>
          <MiniForm
            inputName="penalty-amount"
            label="Fix penalty to amount"
            initialValue={team ? `${team.penalties}` : ''}
            buttonText="Fix"
            onSubmit={v => {
              const newVal = parseInt(v, 10);
              if (!isNaN(newVal)) {
                fixPenalty(newVal);
              }
            }}
          />
        </Popup>
      )}
    </Fragment>
  );
};

export default Settings;
