import type { IFrameView } from "../FrameView";
import type { IGameSession } from "../GameSession";
import { World } from "../world/World";

export interface IEngine {
  process(world: World, frameView: IFrameView, gameSession: IGameSession): void;
}