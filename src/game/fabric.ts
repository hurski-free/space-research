import type { Translator } from "../i18n";
import { Engine } from "./engine/Engine";
import { Game } from "./Game";
import { Canvas2dRender } from "./render/Canvas2dRender";
import { World } from "./world/World";
import { Gameplay } from "./gameplay/Gameplay";
import type { IWorldCreateConfig } from "./world/IWorld";
import type { IFrameView } from "./FrameView";
import type { IGameSession } from "./GameSession";
import type { IActionState, KeyboardActions } from "./gameplay/Actions";
import { preparePressedAction, prepareUpAction } from "./gameplay/action.process";

export interface IGameConfig {
  ctx: CanvasRenderingContext2D;
  translator: Translator;

  actionsKeysMap: Record<KeyboardActions, string>;
}

export function createGame(cfg: IGameConfig) {
  const { ctx, translator, actionsKeysMap } = cfg;

  const worldCfg: IWorldCreateConfig = {
    planetPoolCapacity: 1000,
  };

  const renderer = new Canvas2dRender({ ctx, translator });

  const frameView: IFrameView = {
    width: 0,
    height: 0,
    halfWidth: 0,
    halfHeight: 0,
    camera: [0, 0],
  };

  const gameSession: IGameSession = {
    gameState: 0,
    score: 0,
    actionsMap: new Map<KeyboardActions, IActionState>([
      ['main_engine', preparePressedAction()],
      ['maneur_left_engine', preparePressedAction()],
      ['maneur_right_engine', preparePressedAction()],
      ['scan', prepareUpAction()],
      ['stop_rotation', preparePressedAction()],
    ]),
  };

  return new Game(
    new World(worldCfg),
    new Engine(),
    renderer,
    new Gameplay({ actionsKeysMap }),
    frameView,
    gameSession,
  );
}