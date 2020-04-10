import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { useGameChannel } from './socketContext';

type GameChannelData = ReturnType<typeof useGameChannel>;

type GameContext = {
  code: string;
  game: Game | null;
  gameState: GameState | null;
  die: DieState;
  actions: MoveAction[];
  messages: ChatMessage[];
  disabled: boolean;
  animationOngoing: boolean;
  ownTurn: boolean;
  moveAnimationComplete: (type: keyof GameState['changes']) => void;
  dieAnimationComplete: () => void;
} & GameChannelData;

const GameContext = createContext<GameContext>(null as any);

export const GameProvider: FunctionComponent<{ code: string }> = ({
  code,
  children,
}) => {
  const [game, setGame] = useState<GameContext['game']>(null);
  const [gameState, setGameState] = useState<GameContext['gameState']>(null);
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
    setGame,
    (state, actions) => {
      setGameState(state);
      setActions(actions);
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
    setGameState(
      gameState
        ? {
            ...gameState,
            changes:
              type === 'move'
                ? { ...gameState.changes, move: null }
                : { ...gameState.changes, effects: [] },
          }
        : null,
    );

  const dieAnimationComplete: GameContext['dieAnimationComplete'] = () =>
    setDie(prevState => ({ ...prevState, animate: false }));

  const disabled = !game || !gameState || !!error;
  const animationOngoing =
    !!gameState &&
    (!!gameState.changes.move || !!gameState.changes.effects.length);
  const ownTurn =
    !!playerColor && !!gameState && gameState.currentColor === playerColor;

  return (
    <GameContext.Provider
      value={{
        code,
        game,
        gameState,
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
