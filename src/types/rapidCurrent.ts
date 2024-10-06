export enum RapidCurrentConditionType {
  Null,
  Increase_Log_Speed,
  More_Logs,
  Nausea,
  Slowness
}

export interface RapidCurrentCondition {
  name: RapidCurrentConditionType
  display_name: string
  icon: string
}

export interface RapidCurrentData {
  conditions: RapidCurrentCondition[]
}