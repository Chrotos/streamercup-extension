export enum SharpPathWall {
  TOP_DOWN_1,
  DOWN_TOP_1,
  TOP_DOWN_2,
  DOWN_TOP_2,
  TOP_DOWN_3,
  DOWN_TOP_3,
  TOP_DOWN_4,
  DOWN_TOP_4,
  TOP_DOWN_5,
  DOWN_TOP_5,
  LEFT_RIGHT_6,
  RIGHT_LEFT_6,
  LEFT_RIGHT_7,
  RIGHT_LEFT_7,
  LEFT_RIGHT_8,
  RIGHT_LEFT_8,
  LEFT_RIGHT_9,
  RIGHT_LEFT_9,
  LEFT_RIGHT_10,
  RIGHT_LEFT_10
}

export interface SharpPathData {
  walls: SharpPathWall[]
}