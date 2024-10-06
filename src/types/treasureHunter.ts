export enum TreasureHunterConditionType {
  Null = 'Null',
  Increase_Value  = 'Increase_Value',
  Decrease_Value = 'Decrease_Value',
  Additional_Area = 'Additional_Area',
  Spawn_Golems = 'Spawn_Golems',
  Recreate_Sites = 'Recreate_Sites',
}

export interface TreasureHunterCondition {
  name: TreasureHunterConditionType
  display_name: string
  icon: string
}

export interface TreasureHunterData {
  conditions: TreasureHunterCondition[]
}