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
  moveAnimationComplete: (type: keyof Changes) => void;
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
    (newGame, newActions) => {
      setGame(newGame);
      setActions(newActions);
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

  const moveAnimationComplete: GameContext['moveAnimationComplete'] = type =>
    setChanges(oldChanges =>
      type === 'move'
        ? { ...oldChanges, move: null }
        : { ...oldChanges, effects: [] },
    );

  const dieAnimationComplete: GameContext['dieAnimationComplete'] = () =>
    setDie(prevState => ({ ...prevState, animate: false }));

  const disabled = !game || !!error;
  const animationOngoing =
    !!game && (!!changes.move || !!changes.effects.length);
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
        moveAnimationComplete,
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
