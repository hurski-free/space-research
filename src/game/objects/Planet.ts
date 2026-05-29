import type { ResourceType } from "./IResource";
import { GameObject } from "./Object";

export class Planet extends GameObject {
  readonly resources: Map<ResourceType, boolean>;

  constructor() {
    super();
    this.resources = new Map();
  }

  setResource(resourceType: ResourceType, exists: boolean) {
    this.resources.set(resourceType, exists);
  }
}