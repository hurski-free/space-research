import { COMMON_GRAVITY_CONSTANT } from "../const";

/**
 * states:
 * 
 * 0 - free - object is not in the game
 * 
 * 1 - new - object is new in the game, will processed in next tick
 * 
 * 2 - exist - object is in the game, processed
 * 
 * 3 - deleted - object is deleted from the game, will be removed in next tick
 */
export type ObjectState = 0 | 1 | 2 | 3;

export const OBJ_STATE_FREE    = 0;
export const OBJ_STATE_NEW     = 1;
export const OBJ_STATE_EXIST   = 2;
export const OBJ_STATE_DELETED = 3;

export class GameObject {
  /**
   * 0 - free - object is not in the game
   *
   * 
   * 1 - new - object is new in the game, will processed in next tick
   * 
   * 
   * 2 - exist - object is in the game, processed
   * 
   * 
   * 3 - deleted - object is deleted from the game, will be removed in next tick
   */
  state: ObjectState = OBJ_STATE_FREE;

  size: number = 0;
  private _mass: number = 0;

  x: number = 0;
  y: number = 0;
  
  velocityX: number = 0;
  velocityY: number = 0;
  
  accelerationX: number = 0;
  accelerationY: number = 0;
  
  angle: number = 0;
  angularVelocity: number = 0;
  angularAcceleration: number = 0;

  /**
   * Gravity impacting force is calculated as mass * common gravity constant
   */
  private _gravityImpactingForce: number = 0;

  get gravityImpactingForce(): number {
    return this._gravityImpactingForce;
  }

  get mass(): number {
    return this._mass;
  }

  set mass(value: number) {
    this._mass = value;
    this.computeGravityImpactingForce();
  }

  update() {
    this.velocityX += this.accelerationX;
    this.velocityY += this.accelerationY;

    this.angularVelocity += this.angularAcceleration;

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.angle += this.angularVelocity;

    this.state = OBJ_STATE_EXIST;

    this.accelerationX = 0;
    this.accelerationY = 0;
    this.angularAcceleration = 0;
  }

  /**
   * Use it after force set radius
   */
  private computeGravityImpactingForce() {
    this._gravityImpactingForce = this.mass * COMMON_GRAVITY_CONSTANT;
  }
}