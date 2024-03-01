export interface Potion {
  id: number
  image: string
}

export interface PotionPanicPlayer {
  avatar: string
  id: number
}

export interface PotionPanicData {
  potions: Potion[]
  player: PotionPanicPlayer
}