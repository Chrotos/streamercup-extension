export enum RadiusEraserConditionType {
  Null = 'Null',
  Faster = 'Faster',
  Slowness = 'Slowness',
  Speed = 'Speed'
}

export interface RadiusEraserCondition {
  name: RadiusEraserConditionType
  display_name: string
  icon: string
}

export interface RadiusEraserData {
  conditions: RadiusEraserCondition[]
}