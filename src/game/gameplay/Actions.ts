export type KeyboardActions = 'main_engine'
  | 'maneur_left_engine'
  | 'maneur_right_engine'
  | 'scan'
  | 'stop_rotation';

export type KeysToActionsMap = Map<string, KeyboardActions>;

export interface IActionState {
  pressed: boolean;

  activated: boolean;
  resetAfterActivation?: boolean;

  handler: (action: IActionState, state: boolean) => void;

}

/**
 * Modify action state based on input and current state
 */
export type ActionHandlerFun = (action: IActionState, state: boolean) => void;

export type ActionsMap = Map<KeyboardActions, IActionState>;