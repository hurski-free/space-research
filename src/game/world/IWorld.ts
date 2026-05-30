import type { ILevel } from "../level/ILevel";

export interface IWorld {
  initLevel(level: ILevel): void;
  clear(): void;
  freeMemory(): void;
}

export interface IWorldCreateConfig {
  planetPoolCapacity: number;
}