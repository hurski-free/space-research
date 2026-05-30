/**
 * Mesh for Canvas2D / WebGL rendering.
 *
 * - `vertices`: local-space flat pairs [x0, y0, x1, y1, …]; nose at negative Y when angle = 0
 * - `colors`: RGB per vertex (0–255): [r0, g0, b0, …]
 * - `triangles`: vertex indices in groups of three
 */
export interface IModel {
  /**
   * Normilized vertices
   */
  vertices: number[];
  colors: number[];
  triangles: number[];
  /**
   * Angle of the model in radians
   */
  modelAngle: number;
}
