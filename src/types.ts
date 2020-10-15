export type Mode = "draw" | "erase";

export type Point = {
  x: number;
  y: number;
};

export type Line = [Point, Point];

export type Shape = {
  id: number;
  visible: boolean;
  color: string;
  points: Point[];
};

export type Tile = {
  position: Point;
  shapeIndices: number[];
};

export type Action =
  | {
      type: "draw";
      shapeIndex: number;
    }
  | {
      type: "erase";
      shapeIndices: number[];
    };
