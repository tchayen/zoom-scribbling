export type Point = {
  x: number;
  y: number;
};

export type Shape = {
  points: Point[];
};

export type Tile = {
  position: Point;
  shapeIndices: number[];
};
