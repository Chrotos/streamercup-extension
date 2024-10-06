export enum SweetsCatcherConditionType {
  Null,
  Switch,
  Speed
}

export interface SweetsCatcherCondition {
  name: SweetsCatcherConditionType
  display_name: string
  icon: string
}

export interface SweetsCatcherData {
  conditions: SweetsCatcherCondition[]
}