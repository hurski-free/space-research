import type { ILevel } from "../level/ILevel";
import { ObjectPool } from "../objects/ObjectPool";
import { Planet } from "../objects/Planet";
import { Ship } from "../objects/Ship";
import { applyShipPreset } from "../presets/ship.preset";
import type { IWorld, IWorldCreateConfig } from "./IWorld";

export class World implements IWorld {
  readonly planets: ObjectPool<Planet>;
  readonly ship: Ship;

  constructor(cfg: IWorldCreateConfig) {
    this.planets = new ObjectPool<Planet>(cfg.planetPoolCapacity, () => new Planet());
    this.ship = new Ship();
    applyShipPreset(this.ship);
  }

  initLevel(level: ILevel): void {
    this.clear();

    applyShipPreset(this.ship, level.shipPreset);

    for (const planetCfg of level.planets) {
      const planet = this.planets.getNewObject();
      planet.color = planetCfg.color;
      planet.mass = planetCfg.mass;
      planet.size = planetCfg.radius;
      planet.x = planetCfg.position.x;
      planet.y = planetCfg.position.y;

      for (const resourceCfg of planetCfg.resources) {
        planet.setResource(resourceCfg.resourceType, true);
      }
    }
  }

  clear(): void {
    this.planets.clear();
  }

  freeMemory(): void {
    this.planets.freeMemory();
  }
}