export type Mode = "draw" | "erase" | "select";

export type Point = {
  x: number;
  y: number;
};

export type Line = [Point, Point];

export type Shape = {
  id: number;
  state: "invisible" | "visible" | "erased";
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

export type EditorState = {
  shapes: Shape[];
  history: Action[];
  historyIndex: number;
};
