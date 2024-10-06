export enum TimeCounterConditionType {
  Null,
  Equal_Time,
  Plus_One,
  Minus_One
}

export interface TimeCounterCondition {
  name: TimeCounterConditionType
  display_name: string
  icon: string
}

export interface TimeCounterData {
  conditions: TimeCounterCondition[]
}