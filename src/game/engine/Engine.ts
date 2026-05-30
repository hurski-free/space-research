import type { IEngine } from "./IEngine";
import type { World } from "../world/World";
import type { IFrameView } from "../FrameView";
import type { IGameSession } from "../GameSession";
import { resetActionsMap } from "../gameplay/action.process";
import type { Ship } from "../objects/Ship";
import { applyPlanetGravity, applyShipPlanetSurfaceStick, resolveShipPlanetCollision } from "./collision";
import { OBJ_STATE_EXIST } from "../objects/Object";

export class Engine implements IEngine {

  process(world: World, frameView: IFrameView, gameSession: IGameSession): void {
    const { ship, planets } = world;

    this.applyShipEngines(ship, gameSession);

    const planetArray = planets.getArray();
    const activeCount = planets.activeCount;

    for (let i = 0; i < activeCount; i++) {
      const planet = planetArray[i]!;
      if (planet.state === OBJ_STATE_EXIST) {
        applyPlanetGravity(ship, planet);
      }
    }

    ship.update();
    
    for (let i = 0; i < activeCount; i++) {
      const planet = planetArray[i]!;
      if (planet.state === OBJ_STATE_EXIST) {
        resolveShipPlanetCollision(ship, planet);
        applyShipPlanetSurfaceStick(ship, planet, gameSession);
      }
    }

    for (let i = 0; i < activeCount; i++) {
      planetArray[i]!.update();
    }
    
    frameView.camera[0] = ship.x - frameView.halfWidth;
    frameView.camera[1] = ship.y - frameView.halfHeight;

    resetActionsMap(gameSession.actionsMap);
  }

  private applyShipEngines(ship: Ship, gameSession: IGameSession): void {
    const mainEngine = gameSession.actionsMap.get('main_engine')!;
    if (mainEngine.activated) {
      ship.accelerationX += ship.mainEnginePower / ship.mass * Math.cos(ship.angle);
      ship.accelerationY += ship.mainEnginePower / ship.mass * Math.sin(ship.angle);
    }

    
    const maneuverLeftEngine = gameSession.actionsMap.get('maneur_left_engine')!;
    if (maneuverLeftEngine.activated) {
      ship.angularAcceleration -= ship.maneuverEnginePower / ship.mass;
    }
    
    const maneuverRightEngine = gameSession.actionsMap.get('maneur_right_engine')!;
    if (maneuverRightEngine.activated) {
      ship.angularAcceleration += ship.maneuverEnginePower / ship.mass;
    }
    
    ship.mainEngineOn = mainEngine.activated;
    ship.maneuverEngineLeftOn = maneuverLeftEngine.activated;
    ship.maneuverEngineRightOn = maneuverRightEngine.activated;
  }
}
