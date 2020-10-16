import consts from "./consts";
import { intersect } from "./helpers";
import { Action, Line, Point, Shape } from "./types";

let ids = 1;

export const shapes: Shape[] = [];

export const history: Action[] = [];
let historyIndex = -1;

let drawing = false;
let erasing = false;

let lastPoint: Point | null = null;
let eraseBuffer = new Set<number>();

const reset = () => {
  ids = 1;

  shapes.splice(0, shapes.length);

  history.splice(0, shapes.length);
  historyIndex = -1;

  drawing = false;
  erasing = false;

  lastPoint = null;
  eraseBuffer = new Set<number>();
};

const getShape = (id: number) => {
  const shape = shapes.find((shape) => shape.id === id);
  if (!shape) {
    throw new Error("Shape not found");
  }
  return shape;
};

export const startShape = (point: Point) => {
  drawing = true;
  shapes.push({
    id: ids++,
    color: consts.BRUSH_COLOR,
    points: [point],
    state: "visible",
  });

  history.splice(historyIndex + 1, history.length - historyIndex - 1);
};

export const appendLine = (point: Point) => {
  if (!drawing) {
    return;
  }

  shapes[shapes.length - 1].points.push(point);
};

export const finishShape = () => {
  if (!drawing) {
    return;
  }

  history.push({
    type: "draw",
    shapeIndex: shapes[shapes.length - 1].id,
  });

  historyIndex += 1;
  drawing = false;
};

export const startErase = (point: Point) => {
  erasing = true;
  lastPoint = point;
};

export const appendErase = (point: Point) => {
  if (!erasing) {
    return;
  }

  if (lastPoint === null) {
    throw new Error("Incorrect state");
  }

  const eraseLine: Line = [lastPoint, point];

  for (const shape of shapes) {
    if (shape.state !== "visible") {
      continue;
    }

    for (let i = 1; i < shape.points.length; i++) {
      const line: Line = [shape.points[i - 1], shape.points[i]];
      if (intersect(line, eraseLine)) {
        shape.color = consts.ERASER_COLOR;
        shape.state = "erased";
        eraseBuffer.add(shape.id);
      }
    }
  }

  lastPoint = point;
};

export const finishErase = () => {
  if (!erasing) {
    return;
  }

  history.push({
    type: "erase",
    shapeIndices: [...eraseBuffer],
  });

  historyIndex += 1;

  for (const shape of shapes) {
    if (shape.state === "erased") {
      shape.state = "invisible";
      shape.color = consts.BRUSH_COLOR;
    }
  }

  erasing = false;
};

export const undo = () => {
  if (drawing) {
    shapes.splice(shapes.length - 1, 1);
    drawing = false;
    return;
  }

  if (erasing) {
    erasing = false;
    for (const shape of shapes) {
      if (shape.state === "erased") {
        shape.state = "visible";
      }
    }
    return;
  }

  if (historyIndex >= 0) {
    const recentCommand = history[historyIndex];

    if (recentCommand.type === "draw") {
      const shape = getShape(recentCommand.shapeIndex);
      shape.state = "invisible";
    } else if (recentCommand.type === "erase") {
      const affected = recentCommand.shapeIndices.map((id) => getShape(id));
      for (const shape of affected) {
        shape.state = "visible";
      }
    }

    historyIndex -= 1;
  }
};

export const redo = () => {
  if (historyIndex < history.length - 1) {
    historyIndex += 1;
    const recentCommand = history[historyIndex];

    if (recentCommand.type === "draw") {
      const shape = getShape(recentCommand.shapeIndex);
      shape.state = "visible";
    } else if (recentCommand.type === "erase") {
      const affected = recentCommand.shapeIndices.map((id) => getShape(id));
      for (const shape of affected) {
        shape.state = "invisible";
      }
    }
  }
};

export const __TEST_ONLY__ = {
  get shapes() {
    return shapes;
  },
  get history() {
    return history;
  },
  get historyIndex() {
    return historyIndex;
  },
  reset,
};
