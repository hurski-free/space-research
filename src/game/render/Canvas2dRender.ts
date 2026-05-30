import type { Translator } from "../../i18n";
import {
  MAIN_ENGINE_JET_LENGTH,
  MAIN_ENGINE_JET_WIDTH,
  MANEUVER_ENGINE_JET_LENGTH,
  MANEUVER_ENGINE_JET_WIDTH,
} from "../const";
import type { ImmutableFrameView } from "../FrameView";
import type { ImmutableGameSession } from "../GameSession";
import type { IModel } from "../model/IModel";
import type { Planet } from "../objects/Planet";
import type { Ship } from "../objects/Ship";
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
    const { ctx } = this;
    const { ship } = world;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(-frameView.camera[0], -frameView.camera[1]);

    const planets = world.planets.getArray();

    for (const planet of planets) {
      this.renderPlanet(planet);
    }

    this.renderShip(ship);
    this.renderHud(world, frameView, gameSession);

    ctx.restore();
  }

  /** Nozzle indices in ship model mesh (see ship.preset.ts) */
  private static readonly MAIN_NOZZLE_VERTEX = 6;
  private static readonly MANEUVER_LEFT_NOZZLE_VERTEX = 4;
  private static readonly MANEUVER_RIGHT_NOZZLE_VERTEX = 5;

  private renderShip(ship: Ship) {
    const { ctx } = this;
    const { angle, size, model } = ship;

    if (model.vertices.length < 2 || model.triangles.length < 3 || size <= 0) {
      return;
    }

    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(angle);

    if (ship.mainEngineOn) {
      this.drawMainEngineJet(model, size);
    }

    if (ship.maneuverEngineLeftOn) {
      this.drawManeuverEngineJet(
        model,
        size,
        Canvas2dRender.MANEUVER_LEFT_NOZZLE_VERTEX,
        0,
        1,
      );
    }

    if (ship.maneuverEngineRightOn) {
      this.drawManeuverEngineJet(
        model,
        size,
        Canvas2dRender.MANEUVER_RIGHT_NOZZLE_VERTEX,
        0,
        -1,
      );
    }

    this.drawModelMesh(model, size);

    ctx.restore();
  }

  private getNozzleLocalPosition(model: IModel, size: number, vertexIndex: number): [number, number] {
    const vi = vertexIndex * 2;
    const vx = model.vertices[vi]!;
    const vy = model.vertices[vi + 1]!;
    const sin = Math.sin(model.modelAngle);
    const cos = Math.cos(model.modelAngle);

    return [
      size * (vx * cos - vy * sin),
      size * (vx * sin + vy * cos),
    ];
  }

  private drawMainEngineJet(model: IModel, size: number) {
    const [originX, originY] = this.getNozzleLocalPosition(
      model,
      size,
      Canvas2dRender.MAIN_NOZZLE_VERTEX,
    );

    this.drawEngineJet(originX, originY, -1, 0, MAIN_ENGINE_JET_LENGTH, MAIN_ENGINE_JET_WIDTH, true);
  }

  private drawManeuverEngineJet(
    model: IModel,
    size: number,
    nozzleVertex: number,
    dirX: number,
    dirY: number,
  ) {
    const [originX, originY] = this.getNozzleLocalPosition(model, size, nozzleVertex);

    this.drawEngineJet(
      originX,
      originY,
      dirX,
      dirY,
      MANEUVER_ENGINE_JET_LENGTH,
      MANEUVER_ENGINE_JET_WIDTH,
      false,
    );
  }

  private drawEngineJet(
    originX: number,
    originY: number,
    dirX: number,
    dirY: number,
    length: number,
    width: number,
    isMain: boolean,
  ) {
    const { ctx } = this;
    const tipX = originX + dirX * length;
    const tipY = originY + dirY * length;
    const perpX = -dirY;
    const perpY = dirX;
    const halfWidth = width * 0.5;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(tipX + perpX * halfWidth, tipY + perpY * halfWidth);
    ctx.lineTo(tipX - perpX * halfWidth, tipY - perpY * halfWidth);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(originX, originY, tipX, tipY);

    if (isMain) {
      gradient.addColorStop(0, "rgba(255, 210, 120, 0.95)");
      gradient.addColorStop(0.45, "rgba(255, 120, 50, 0.75)");
      gradient.addColorStop(1, "rgba(255, 70, 20, 0)");
    } else {
      gradient.addColorStop(0, "rgba(255, 170, 90, 0.9)");
      gradient.addColorStop(0.5, "rgba(255, 100, 50, 0.55)");
      gradient.addColorStop(1, "rgba(255, 60, 20, 0)");
    }

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  private drawModelMesh(model: IModel, size: number) {
    const { ctx } = this;
    const { vertices, colors, triangles } = model;

    ctx.save();
    ctx.rotate(model.modelAngle);

    for (let t = 0; t < triangles.length; t += 3) {
      const v0 = triangles[t]! * 2;
      const v1 = triangles[t + 1]! * 2;
      const v2 = triangles[t + 2]! * 2;

      const c0 = triangles[t]! * 3;
      const c1 = triangles[t + 1]! * 3;
      const c2 = triangles[t + 2]! * 3;

      ctx.beginPath();
      ctx.moveTo(vertices[v0]! * size, vertices[v0 + 1]! * size);
      ctx.lineTo(vertices[v1]! * size, vertices[v1 + 1]! * size);
      ctx.lineTo(vertices[v2]! * size, vertices[v2 + 1]! * size);
      ctx.closePath();

      const r = (colors[c0]! + colors[c1]! + colors[c2]!) / 3;
      const g = (colors[c0 + 1]! + colors[c1 + 1]! + colors[c2 + 1]!) / 3;
      const b = (colors[c0 + 2]! + colors[c1 + 2]! + colors[c2 + 2]!) / 3;

      ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
      ctx.fill();

      ctx.strokeStyle = "rgba(12, 15, 20, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderPlanet(planet: Planet) {
    const { ctx } = this;
    const { color, size, x, y } = planet;

    ctx.fillStyle = `rgb(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  private renderHud(world: World, frameView: ImmutableFrameView, gameSession: ImmutableGameSession) {
    void world;
    void frameView;
    void gameSession;

    // render fuel bar, bottom centered
  }
}
