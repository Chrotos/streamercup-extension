export enum RapidCurrentConditionType {
  Null,
  Increase_Log_Speed,
  More_Logs,
  Nausea,
  Slowness
}

export interface RapidCurrentCondition {
  name: RapidCurrentConditionType
  icon: string
}

export interface RapidCurrentData {
  conditions: RapidCurrentCondition[]
}