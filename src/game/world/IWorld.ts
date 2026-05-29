export interface IWorld {
  clear(): void;
  freeMemory(): void;
}

export interface IWorldCreateConfig {
  planetPoolCapacity: number;
}