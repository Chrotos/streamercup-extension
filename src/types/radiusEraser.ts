export enum RadiusEraserConditionType {
  Null,
  Faster,
  Slowness,
  Speed
}

export interface RadiusEraserCondition {
  name: RadiusEraserConditionType
  icon: string
}

export interface RadiusEraserData {
  conditions: RadiusEraserCondition[]
}