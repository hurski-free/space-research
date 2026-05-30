import type { IResource } from "../objects/IResource";
import type { IShipPreset } from "../presets/ship.preset";

interface IPlanet {
  color: number[];
  mass: number;
  radius: number;
  position: {
    x: number;
    y: number;
  };
  resources: IResource[];
}

export interface ILevel {
  planets: IPlanet[];

  shipPreset?: IShipPreset;
}