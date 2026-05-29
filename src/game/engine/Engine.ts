import type { IEngine } from "./IEngine";
import type { World } from "../world/World";
import type { IFrameView } from "../FrameView";
import type { IGameSession } from "../GameSession";
import { resetActionsMap } from "../gameplay/action.process";

export class Engine implements IEngine {

  process(world: World, frameView: IFrameView, gameSession: IGameSession): void {
    void frameView;
    void world;

    const mainEngine = gameSession.actionsMap.get('main_engine');

    if (mainEngine?.activated) {
      console.log('main engine');
    }

    resetActionsMap(gameSession.actionsMap);
  }
}