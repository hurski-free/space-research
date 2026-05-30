import type { Ship } from "../objects/Ship";
import type { IModel } from "../model/IModel";

/**
 * Arrow-shaped hull in local space (nose up, engines down).
 * Vertices are normalized: divided by max extent (22) so |coord| <= 1.
 *
 *     0
 *    / \
 *   1   3
 *    \ /
 *  4  2  5
 *   \ | /
 *     6
 */
const baseShipModelPreset = {
  vertices: [
    0, -1,
    -6 / 11, 4 / 11,
    0, 5 / 11,
    6 / 11, 4 / 11,
    -5 / 22, 7 / 11,
    5 / 22, 7 / 11,
    0, 17 / 22,
  ],
  colors: [
    180, 250, 240,
    45, 150, 138,
    80, 210, 195,
    45, 150, 138,
    255, 110, 70,
    255, 110, 70,
    255, 170, 90,
  ],
  triangles: [
    0, 1, 2,
    0, 2, 3,
    2, 1, 4,
    2, 4, 6,
    2, 6, 5,
    2, 5, 3,
  ],
  modelAngle: Math.PI / 2,
} satisfies IModel;

export interface IShipPreset {
  model: IModel;
  size: number;
  mainEnginePower: number;
  maneuverEnginePower: number;
  scanRadius: number;
  maxFuelTank: number;
  mass: number;
}

export const baseShipPreset = {
  model: baseShipModelPreset,
  size: 25, // in pixels
  mainEnginePower: 10_000,
  maneuverEnginePower: 100,
  scanRadius: 350,
  maxFuelTank: 10_000,
  mass: 500_000,
} satisfies IShipPreset;

export function applyShipPreset(ship: Ship, preset: IShipPreset = baseShipPreset): void {
  ship.model = preset.model;
  ship.size = preset.size;
  ship.mainEnginePower = preset.mainEnginePower;
  ship.maneuverEnginePower = preset.maneuverEnginePower;
  ship.scanRadius = preset.scanRadius;
  ship.maxFuelTank = preset.maxFuelTank;
  ship.fuel = preset.maxFuelTank;
  ship.mass = preset.mass;
}
