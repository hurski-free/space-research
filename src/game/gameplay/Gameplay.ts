import type { ImmutableGameSession } from "../GameSession";
import type { IGameplay, IGameplayConfig } from "./IGameplay";
import type { KeyboardActions } from "./Actions";

export class Gameplay implements IGameplay {
  readonly keysToActionsMap: Readonly<Record<string, KeyboardActions>>;

  constructor(cfg: IGameplayConfig) {
    // transform actions keys map to keys to actions map
    this.keysToActionsMap = Object.entries(cfg.actionsKeysMap).reduce((acc, [key, value]) => {
      acc[value] = key as KeyboardActions;
      return acc;
    }, {} as Record<string, KeyboardActions>);
  }

  handleKeyboardInput(gameSession: ImmutableGameSession, keyboardInput: KeyboardEvent, state: boolean): void {
    const action = this.keysToActionsMap[keyboardInput.code];
    if (action) {
      const actionState = gameSession.actionsMap.get(action)!;
      actionState.handler(actionState, state);
    }
  }
}