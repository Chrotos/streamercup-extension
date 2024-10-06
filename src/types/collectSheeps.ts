export enum CollectSheepGate {
  EAST_1 = 'EAST_1',
  WEST_1 = 'WEST_1',
  EAST_2 = 'EAST_2',
  WEST_2 = 'WEST_2',
  SOUTH_1 = 'SOUTH_1',
  NORTH_1 = 'NORTH_1',
  SOUTH_2 = 'SOUTH_2',
  NORTH_2 = 'NORTH_2',
}

export interface CollectSheepsData {
  gates: CollectSheepGate[]
}