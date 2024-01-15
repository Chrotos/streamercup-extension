export enum EstimateSheepsConditionType {
  Null,
  Leap,
  Speed,
  Blindness
}

export interface EstimateSheepsCondition {
  name: EstimateSheepsConditionType
  icon: string
}

export interface EstimateSheepsData {
  conditions: EstimateSheepsCondition[]
}