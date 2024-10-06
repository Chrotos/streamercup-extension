export enum EstimateSheepsConditionType {
  Null = 'Null',
  Leap = 'Leap',
  Speed = 'Speed',
  Blindness = 'Blindness',
}

export interface EstimateSheepsCondition {
  name: EstimateSheepsConditionType
  display_name: string
  icon: string
}

export interface EstimateSheepsData {
  conditions: EstimateSheepsCondition[]
}