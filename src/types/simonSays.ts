export enum SimonSaysConditionType {
  Null,
  Normal,
  Inverted
}

export interface SimonSaysCondition {
  name: SimonSaysConditionType
  icon: string
}

export interface SimonSaysData {
  conditions: SimonSaysCondition[]
}