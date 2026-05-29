import type { Translator } from "../../i18n";
import type { ImmutableFrameView } from "../FrameView";
import type { ImmutableGameSession } from "../GameSession";
import { World } from "../world/World";

export interface IRender {
  readonly translator: Translator;
  render(world: World, frameView: ImmutableFrameView, gameSession: ImmutableGameSession): void;
}