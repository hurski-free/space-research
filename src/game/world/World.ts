import { ObjectPool } from "../objects/ObjectPool";
import { Planet } from "../objects/Planet";
import type { IWorld, IWorldCreateConfig } from "./IWorld";

export class World implements IWorld {
  readonly planets: ObjectPool<Planet>;

  constructor(cfg: IWorldCreateConfig) {
    this.planets = new ObjectPool<Planet>(cfg.planetPoolCapacity, () => new Planet());
  }

  clear(): void {
    this.planets.clear();
  }

  freeMemory(): void {
    this.planets.freeMemory();
  }
}