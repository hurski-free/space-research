import type { ILevel } from "../ILevel";

export const level1: ILevel = {
  planets: [
    {
      color: [102, 51, 0], // brown
      mass: 1000_000,
      radius: 100,
      position: { x: 500, y: 0 },
      resources: [
        {
          resourceType: 'metall',
        },
        {
          resourceType: 'fuel',
        },
      ],
    },
    {
      color: [30, 240, 10], // green
      mass: 2000_000,
      radius: 150,
      position: { x: 600, y: -500 },
      resources: [
        {
          resourceType: 'metall',
        },
        {
          resourceType: 'fuel',
        },
      ],
    },
  ],
};