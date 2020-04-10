import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import Button from './Button';
import MiniForm from './MiniForm';
import Popup from './Popup';
import { useGameContext } from '../utils/gameContext';

const Settings: FunctionalComponent<{
  extraCss?: string;
}> = ({ extraCss }) => {
  const { game, playerColor, fixPenalty } = useGameContext();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!playerColor || !game) {
    // If nothing can be done, do not show settings at all
    return null;
  }

  const player = game.players.find(p => p.color === playerColor);

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
        <Popup close={() => setSettingsOpen(false)} title="Settings">
          <MiniForm
            inputName="penalty-amount"
            label="Fix penalty amount"
            initialValue={player ? `${player.penalties}` : ''}
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
