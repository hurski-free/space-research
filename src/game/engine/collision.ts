import type { IGameSession } from "../GameSession";
import {
  SHIP_PLANET_COLLISION_RESTITUTION,
  SHIP_PLANET_CONTACT_EPSILON,
  SHIP_PLANET_LANDING_SPEED,
  SHIP_PLANET_SURFACE_FRICTION,
} from "../const";
import { len } from "../math";
import type { Planet } from "../objects/Planet";
import type { Ship } from "../objects/Ship";

export function isShipPlanetInContact(ship: Ship, planet: Planet): boolean {
  const dx = ship.x - planet.x;
  const dy = ship.y - planet.y;
  const dist = len(dx, dy);
  const minDist = ship.size + planet.size;

  return dist <= minDist + SHIP_PLANET_CONTACT_EPSILON;
}

/**
 * Gravity toward the planet. In surface contact, inward normal acceleration is
 * cancelled so the planet supports the ship and engines can lift off.
 */
export function applyPlanetGravity(ship: Ship, planet: Planet): void {
  const dx = ship.x - planet.x;
  const dy = ship.y - planet.y;
  const dist = len(dx, dy);

  if (dist < 1e-6) {
    return;
  }

  const distSq = dist * dist;
  let accelX = -planet.gravityImpactingForce * dx / distSq;
  let accelY = -planet.gravityImpactingForce * dy / distSq;

  if (isShipPlanetInContact(ship, planet)) {
    const nx = dx / dist;
    const ny = dy / dist;
    const accelNormal = accelX * nx + accelY * ny;

    if (accelNormal < 0) {
      accelX -= accelNormal * nx;
      accelY -= accelNormal * ny;
    }
  }

  ship.accelerationX += accelX;
  ship.accelerationY += accelY;
}

/**
 * Resolves circle–circle overlap between ship and planet.
 * Planet is treated as immovable. Low-speed impacts stick to the surface.
 */
export function resolveShipPlanetCollision(ship: Ship, planet: Planet): void {
  const minDist = ship.size + planet.size;

  const dx = ship.x - planet.x;
  const dy = ship.y - planet.y;
  let dist = len(dx, dy);

  if (dist >= minDist) {
    return;
  }

  let nx: number;
  let ny: number;

  if (dist < 1e-6) {
    nx = 0;
    ny = -1;
    dist = 0;
  } else {
    nx = dx / dist;
    ny = dy / dist;
  }

  const overlap = minDist - dist;
  ship.x += nx * overlap;
  ship.y += ny * overlap;

  const velocityNormal = ship.velocityX * nx + ship.velocityY * ny;

  if (velocityNormal >= 0) {
    return;
  }

  const impactSpeed = -velocityNormal;
  const velocityTangentX = ship.velocityX - velocityNormal * nx;
  const velocityTangentY = ship.velocityY - velocityNormal * ny;

  if (impactSpeed <= SHIP_PLANET_LANDING_SPEED) {
    ship.velocityX = velocityTangentX * SHIP_PLANET_SURFACE_FRICTION;
    ship.velocityY = velocityTangentY * SHIP_PLANET_SURFACE_FRICTION;
    return;
  }

  const bouncedNormal = SHIP_PLANET_COLLISION_RESTITUTION * impactSpeed;
  ship.velocityX = velocityTangentX + bouncedNormal * nx;
  ship.velocityY = velocityTangentY + bouncedNormal * ny;
}

function isMainEngineActive(gameSession: IGameSession): boolean {
  return gameSession.actionsMap.get('main_engine')!.activated;
}

function isManeuverEngineActive(gameSession: IGameSession): boolean {
  return gameSession.actionsMap.get('maneur_left_engine')!.activated
    || gameSession.actionsMap.get('maneur_right_engine')!.activated;
}

/**
 * When main engine is off, ship rests on the planet surface without drifting.
 * Rotation is frozen too unless maneuver engines are firing.
 */
export function applyShipPlanetSurfaceStick(
  ship: Ship,
  planet: Planet,
  gameSession: IGameSession,
): void {
  if (isMainEngineActive(gameSession) || !isShipPlanetInContact(ship, planet)) {
    return;
  }

  const dx = ship.x - planet.x;
  const dy = ship.y - planet.y;
  const dist = len(dx, dy);

  if (dist < 1e-6) {
    return;
  }

  const minDist = ship.size + planet.size;
  const nx = dx / dist;
  const ny = dy / dist;

  ship.x = planet.x + nx * minDist;
  ship.y = planet.y + ny * minDist;
  ship.velocityX = 0;
  ship.velocityY = 0;

  if (!isManeuverEngineActive(gameSession)) {
    ship.angularVelocity = 0;
  }
}
