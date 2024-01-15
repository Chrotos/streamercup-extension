export enum SweetsCatcherConditionType {
  Null,
  Switch,
  Speed
}

export interface SweetsCatcherCondition {
  name: SweetsCatcherConditionType
  icon: string
}

export interface SweetsCatcherData {
  conditions: SweetsCatcherCondition[]
}