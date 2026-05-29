import type { IFrameView } from "./FrameView";
import type { IGameSession } from "./GameSession";
import type { IEngine } from "./engine/IEngine";
import type { IGameplay } from "./gameplay/IGameplay";
import type { IRender } from "./render/IRender";
import { World } from "./world/World";
import type { GameState } from "./GameSession";

/**
 * non-optimized game class
 * For SoA just use number for indexes
 */
export class Game {
  private readonly world: World;
  private readonly engine: IEngine;
  private readonly renderer: IRender;
  private readonly gameplay: IGameplay;
  private readonly frameView: IFrameView;
  private readonly gameSession: IGameSession;

  protected animationFrameId: number = 0;
  protected _prevTimestamp: DOMHighResTimeStamp = 0;

  constructor(world: World, engine: IEngine, renderer: IRender, gameplay: IGameplay, frameView: IFrameView, gameSession: IGameSession) {
    this.world = world;
    this.engine = engine;
    this.renderer = renderer;
    this.gameplay = gameplay;
    this.frameView = frameView;
    this.gameSession = gameSession;
  }

  /**
   * See {@link GameState}
   */
  get gameState() {
    return this.gameSession.gameState;
  }

  start() {
    if (this.gameSession.gameState === 0) {
      this.gameSession.gameState = 1;

      this.frameView.camera[0] = -this.frameView.halfWidth;
      this.frameView.camera[1] = -this.frameView.halfHeight;  

      this._prevTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
    }
  }

  tick(now: DOMHighResTimeStamp) {
    if (this.gameSession.gameState === 1) {
      const deltaTime = now - this._prevTimestamp;
      this._prevTimestamp = now;

      if (deltaTime > 200) {
        // ignore cycle
        this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
      } else {  
        this.engine.process(this.world, this.frameView, this.gameSession);
        this.renderer.render(this.world, this.frameView, this.gameSession);
        this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
      }
    }
  }

  /**
   * Handle keyboard input
   */
  public handleKeyboardInput(keyboardInput: KeyboardEvent, state: boolean): void {
    this.gameplay.handleKeyboardInput(this.gameSession, keyboardInput, state);
  }

  pause() {
    if (this.gameSession.gameState === 1) {
      this.gameSession.gameState = 2;
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  resume() {
    if (this.gameSession.gameState === 2) {
      this.gameSession.gameState = 1;

      this._prevTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
    }
  }

  stop() {
    if (this.gameSession.gameState !== 0) {
      this.gameSession.gameState = 0;
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
      this.world.clear();
      this.renderer.render(this.world, this.frameView, this.gameSession);
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  resizeCanvas(width: number, height: number, cameraSet = false) {
    this.frameView.width = width;
    this.frameView.height = height;
    this.frameView.halfWidth = width / 2;
    this.frameView.halfHeight = height / 2;

    if (cameraSet) {
      this.frameView.camera[0] = -this.frameView.halfWidth;
      this.frameView.camera[1] = -this.frameView.halfHeight;
    }

    if (this.gameSession.gameState === 2) {
      this.renderer.render(this.world, this.frameView, this.gameSession);
    }
  }

  cameraMove(deltaX: number, deltaY: number) {
    this.frameView.camera[0] -= deltaX;
    this.frameView.camera[1] -= deltaY;

    if (this.gameSession.gameState === 2) {
      this.renderer.render(this.world, this.frameView, this.gameSession);
    }
  }
}
