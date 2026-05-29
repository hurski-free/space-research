import type { Translator } from "../../i18n";
import type { ImmutableFrameView } from "../FrameView";
import type { ImmutableGameSession } from "../GameSession";
import type { World } from "../world/World";
import type { IRender } from "./IRender";

export interface ICanvas2dRenderConfig {
  ctx: CanvasRenderingContext2D;
  translator: Translator;
}

export class Canvas2dRender implements IRender {
  readonly translator: Translator;
  
  private ctx: CanvasRenderingContext2D;

  constructor(cfg: ICanvas2dRenderConfig) {
    this.translator = cfg.translator;
    this.ctx = cfg.ctx;
  }

  render(world: World, frameView: ImmutableFrameView, gameSession: ImmutableGameSession): void {
    void world;
    void frameView;
    void gameSession;
    void this.ctx;
  }
}
