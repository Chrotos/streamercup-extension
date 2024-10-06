export enum SimonSaysConditionType {
  Null,
  Normal,
  Inverted
}

export interface SimonSaysCondition {
  name: SimonSaysConditionType
  display_name: string
  icon: string
}

export interface SimonSaysData {
  conditions: SimonSaysCondition[]
}