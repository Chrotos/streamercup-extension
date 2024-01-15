export enum TimeCounterConditionType {
  Null,
  Equal_Time,
  Plus_One,
  Minus_One
}

export interface TimeCounterCondition {
  name: TimeCounterConditionType
  icon: string
}

export interface TimeCounterData {
  conditions: TimeCounterCondition[]
}