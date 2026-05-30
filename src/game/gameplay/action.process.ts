import type { ActionHandlerFun, IActionState, KeyboardActions } from "./Actions";

/**
 * Action must be executed when button is pressed
 */
export const pressedAction: ActionHandlerFun = (action, state) => {
  action.pressed = state;

  action.activated = state;
};

/**
 * Action must be executed only once after keyup
 */
export const upAction: ActionHandlerFun = (action, state) => {  
  if (!state) {
    if (action.pressed) {
      action.pressed = false;
      action.activated = true;
    }
  }

  action.pressed = state;
};

export const resetActionsMap = (actionsMap: Map<KeyboardActions, IActionState>) => {
  actionsMap.forEach((action) => {
    if (action.resetAfterActivation) {
      action.activated = false;
    }
  });
};


export function preparePressedAction() {
  return {
    pressed: false,
    activated: false,
    handler: pressedAction,
    resetAfterActivation: false,
  } satisfies IActionState;
}

export function prepareUpAction() {
  return {
    pressed: false,
    activated: false,
    handler: upAction,
    resetAfterActivation: true,
  } satisfies IActionState;
}