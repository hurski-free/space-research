/**
 * Rules for constants
 * 
 * Short names:
 */

// *****************************************************
// * GLOBAL CONSTANTS PART
// *****************************************************

/**
 * Common gravitational constant, all gravity impacts will multiplies on this value
 */
export const COMMON_GRAVITY_CONSTANT = 0.000003;

/** Bounce factor for high-speed impacts (0 = no bounce, 1 = fully elastic) */
export const SHIP_PLANET_COLLISION_RESTITUTION = 0.05;

/** Impact speed below this is treated as landing — no bounce */
export const SHIP_PLANET_LANDING_SPEED = 2.5;

/** Slows sliding along the surface after landing */
export const SHIP_PLANET_SURFACE_FRICTION = 0.92;

/** Distance slack for treating ship as resting on the planet surface */
export const SHIP_PLANET_CONTACT_EPSILON = 1;

// *****************************************************
// * ENGINE JET VFX PART (pixels, ship local space)
// *****************************************************

export const MAIN_ENGINE_JET_LENGTH = 32;
export const MAIN_ENGINE_JET_WIDTH = 14;

export const MANEUVER_ENGINE_JET_LENGTH = 32;
export const MANEUVER_ENGINE_JET_WIDTH = 4;
