import type {
  ChooseWisely, CollectSheeps, ComboCannon, CopyStructures, EstimateSheeps, FloeNudging, FoldFigures, MatchingPlatform,
  PuzzlePortrait, RadiusEraser, SharpPath, SimonSays, SoundSequence, SweetsCatcher, TrafficLight, TimeCounter
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
  Achtung_Ampel
}

export interface Game {
  id: GameID
  data: GameData
}

export type GameData = CollectSheeps.CollectSheepsData | SharpPath.SharpPathData | SoundSequence.SoundSequenceData |
                        PuzzlePortrait.PuzzlePortraitData | TrafficLight.TrafficLightData | ChooseWisely.ChooseWiselyData |
                        SweetsCatcher.SweetsCatcherData | FloeNudging.FloeNudgingData | EstimateSheeps.EstimateSheepsData |
                        FoldFigures.FoldFiguresData | RadiusEraser.RadiusEraserData | SimonSays.SimonSaysData |
                        ComboCannon.ComboCannonData | TimeCounter.TimeCounterData | CopyStructures.CopyStructuresData |
                        MatchingPlatform.MatchingPlatformData

export interface VoteOption {
  game_id: string
  name: string
  description: string
  image_url: string
  votes: number
}

export interface VoteData {
  title: string
  options: VoteOption[]
  end_date: string
}