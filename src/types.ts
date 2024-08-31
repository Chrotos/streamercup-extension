import type {
  ChooseWisely, CollectSheeps, ComboCannon, CopyStructures, EnergyEntropy, EstimateSheeps, FloeNudging, FoldFigures,
  MatchingPlatform, PotionPanic, PuzzlePortrait, RadiusEraser, SharpPath, SimonSays, SoundSequence, SweetsCatcher,
  TrafficLight, TimeCounter, TreasureHunter, RapidCurrent, BeatTheBeast, MonsterSlaughter, HallwayHaste
} from '@/types/games'

export enum Phase {
  Pause,
  Voting,
  Game
}

export enum GameID {
  Empty,
  Schafe_sammeln,
  Scharfe_Schneise,
  Sound_Sequenz,
  Waehle_weise,
  Kombi_Kanone,
  Konstrukte_kopieren,
  Schaefchen_schaetzen,
  Schollen_Schubser,
  Figuren_falten,
  Passende_Plattform,
  Puzzle_Portrait,
  Radius_Radierer,
  Suessigkeiten_Schnapper,
  Simon_says,
  Zeit_Zaehler,
  Achtung_Ampel,
  Potion_Panik,
  Energie_Entropie,
  Schatz_Sammler,
  Schnelle_Stroemung,
  Bestien_Bangen,
  Monster_Metzeln,
  Hallway_Haste
}

export interface Game {
  id: GameID
  data: GameData
}

export type GameData = CollectSheeps.CollectSheepsData | SharpPath.SharpPathData | SoundSequence.SoundSequenceData | PotionPanic.PotionPanicData |
                        PuzzlePortrait.PuzzlePortraitData | TrafficLight.TrafficLightData | ChooseWisely.ChooseWiselyData |
                        SweetsCatcher.SweetsCatcherData | FloeNudging.FloeNudgingData | EnergyEntropy.EnergyEntropyData |
                        EstimateSheeps.EstimateSheepsData | FoldFigures.FoldFiguresData | RadiusEraser.RadiusEraserData |
                        SimonSays.SimonSaysData | ComboCannon.ComboCannonData | TimeCounter.TimeCounterData | CopyStructures.CopyStructuresData |
                        MatchingPlatform.MatchingPlatformData | TreasureHunter.TreasureHunterData | RapidCurrent.RapidCurrentData |
                        BeatTheBeast.BeatTheBeastData | MonsterSlaughter.MonsterSlaughterData | HallwayHaste.HallwayHasteData

export interface VoteOption {
  game_id: string
  name: string
  description: string
  image_url: string
  votes: number
  new?: boolean
}

export interface VoteData {
  title: string
  options: VoteOption[]
  end_date: string
}
