export enum TreasureHunterConditionType {
  Null,
  Increase_Value,
  Decrease_Value,
  Additional_Area,
  Spawn_Golems,
  Recreate_Sites
}

export interface TreasureHunterCondition {
  name: TreasureHunterConditionType
  icon: string
}

export interface TreasureHunterData {
  conditions: TreasureHunterCondition[]
}