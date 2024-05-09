export enum TreasureHunterConditionType {
  Null,
  Switch_Players,
  Additional_Area,
  Randomize_Values,
  Recreate_Sites,
  Spawn_Golems
}

export interface TreasureHunterCondition {
  name: TreasureHunterConditionType
  icon: string
}

export interface TreasureHunterData {
  conditions: TreasureHunterCondition[]
}