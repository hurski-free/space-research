import type { IModel } from "../model/IModel";
import { GameObject } from "./Object";

export class Ship extends GameObject {
  mainEnginePower: number = 0;
  mainEngineOn: boolean = false;
  maneuverEnginePower: number = 0;
  maneuverEngineLeftOn: boolean = false;
  maneuverEngineRightOn: boolean = false;

  maxFuelTank: number = 0;
  fuel: number = 0;

  scanRadius: number = 0;

  model!: IModel;

  constructor() {
    super();
  }
}