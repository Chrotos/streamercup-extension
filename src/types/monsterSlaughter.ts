export interface MonsterSlaughterEffect {
  name: string
  image: string
}

export interface MonsterSlaughterData {
  boss_names: string[]|null
  arena_effects: MonsterSlaughterEffect[]|null
  shop_effects: MonsterSlaughterEffect[]|null
}