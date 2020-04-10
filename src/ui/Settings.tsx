import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import Button from './Button';
import MiniForm from './MiniForm';
import Popup from './Popup';

const Settings: FunctionalComponent<{
  penalties?: number;
  fixPenalty?: (amount: number) => void;
  extraCss?: string;
}> = ({ penalties, fixPenalty, extraCss }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!fixPenalty || penalties === undefined) {
    // If nothing can be done, do not show settings at all
    return null;
  }

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
            initialValue={`${penalties}`}
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
