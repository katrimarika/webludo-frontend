import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { useGameContext } from '../utils/gameContext';
import Popup from './Popup';
import ShareLink from './ShareLink';

const GameSetup: FunctionalComponent = () => {
  const { game } = useGameContext();

  return (
    <Popup close={() => null} title="Game setup">
      <ShareLink />
    </Popup>
  );
};

export default GameSetup;
