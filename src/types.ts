export type Point = {
  x: number;
  y: number;
};

export type Shape = {
  id: number;
  visible: boolean;
  points: Point[];
};

export type Tile = {
  position: Point;
  shapeIndices: number[];
};

export type Action = {
  type: "draw" | "erase";
  shapeIndex: number;
};
