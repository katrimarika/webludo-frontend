import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { useGameChannel } from './socketContext';

type GameChannelData = ReturnType<typeof useGameChannel>;

type GameContext = {
  code: string;
  game: Game | null;
  changes: Changes;
  die: DieState;
  actions: MoveAction[];
  messages: ChatMessage[];
  disabled: boolean;
  animationOngoing: boolean;
  ownTurn: boolean;
  changeAnimationComplete: (type: keyof Changes) => void;
  dieAnimationComplete: () => void;
} & GameChannelData;

const GameContext = createContext<GameContext>(null as any);

export const GameProvider: FunctionComponent<{ code: string }> = ({
  code,
  children,
}) => {
  const [game, setGame] = useState<GameContext['game']>(null);
  const [changes, setChanges] = useState<GameContext['changes']>({
    move: null,
    doubled: null,
    effects: [],
  });
  const [die, setDie] = useState<GameContext['die']>({
    roll: Math.ceil(Math.random() * 6),
    position: Math.random(),
    distance: Math.random(),
    orientation: Math.random(),
    animate: false,
  });
  const [actions, setActions] = useState<GameContext['actions']>([]);
  const [messages, setMessages] = useState<GameContext['messages']>([]);
  const { playerColor, error, ...restChannelData } = useGameChannel(
    code,
    (newGame, newActions, newRoll) => {
      setGame(newGame);
      setActions(newActions);
      if (newRoll) {
        setDie(oldDie => ({ ...oldDie, roll: newRoll, animate: false }));
      }
    },
    (newGame, newActions, newChanges) => {
      setGame(newGame);
      setActions(newActions);
      setChanges(newChanges);
    },
    roll =>
      setDie({
        roll,
        position: Math.random(),
        distance: Math.random(),
        orientation: Math.random(),
        animate: true,
      }),
    m => setMessages(ms => [...ms, m]),
  );

  const changeAnimationComplete: GameContext['changeAnimationComplete'] = type =>
    setChanges(oldChanges => {
      switch (type) {
        case 'move':
          return { ...oldChanges, move: null };
        case 'doubled':
          return { ...oldChanges, doubled: null };
        case 'effects':
          return { ...oldChanges, effects: [] };
        default:
          return oldChanges;
      }
    });

  const dieAnimationComplete: GameContext['dieAnimationComplete'] = () =>
    setDie(prevState => ({ ...prevState, animate: false }));

  const disabled = !game || !!error;
  const animationOngoing =
    !!game &&
    !!(
      changes.move ||
      changes.doubled ||
      changes.effects.length ||
      die.animate
    );
  const ownTurn = !!playerColor && !!game && game.currentColor === playerColor;

  return (
    <GameContext.Provider
      value={{
        code,
        game,
        changes,
        die,
        actions,
        messages,
        disabled,
        ownTurn,
        animationOngoing,
        changeAnimationComplete,
        dieAnimationComplete,
        playerColor,
        error,
        ...restChannelData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
