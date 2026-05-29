export type ResourceType = 'metall' | 'fuel' | 'water';

export interface IResource {
  readonly resourceType: ResourceType;
}