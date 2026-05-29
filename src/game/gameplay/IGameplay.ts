import type { ImmutableGameSession } from "../GameSession";
import type { KeyboardActions } from "./Actions";

export interface IGameplay {
  /**
   * Map of keyboard actions to their keys
   */
  readonly keysToActionsMap: Readonly<Record<string, KeyboardActions>>;
  handleKeyboardInput(gameSession: ImmutableGameSession, keyboardInput: KeyboardEvent, state: boolean): void;
}

export interface IGameplayConfig {
  readonly actionsKeysMap: Readonly<Record<KeyboardActions, string>>;
}