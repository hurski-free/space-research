import type { ActionsMap } from "./gameplay/Actions";

/**
 * States: 
 * 0 - wait_for_start - game is waiting for start
 * 1 - running - game is running
 * 2 - paused - game is paused
 * 3 - game_over - game is over
 */
export type GameState = 0 | 1 | 2 | 3;

export interface IGameSession {
  /**
   * Current game state, see {@link GameState}
   */
  gameState: GameState;

  score: number;
  
  actionsMap: ActionsMap;
}

export type ImmutableGameSession = Readonly<IGameSession>;
