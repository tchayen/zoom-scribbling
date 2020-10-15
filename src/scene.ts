import { intersect } from "./helpers";
import { Action, Line, Point, Shape } from "./types";

let ids = 1;

export const shapes: Shape[] = [];

export const history: Action[] = [];
let historyIndex = -1;

const getShape = (id: number) => {
  const shape = shapes.find((shape) => shape.id === id);
  if (!shape) {
    throw new Error("Shape not found");
  }
  return shape;
};

export const startShape = (point: Point) => {
  shapes.push({
    id: ids++,
    color: "#000",
    points: [point],
    visible: true,
  });

  history.splice(historyIndex + 1, history.length - historyIndex - 1);
};

export const appendLine = (point: Point) => {
  shapes[shapes.length - 1].points.push(point);
};

export const finishShape = () => {
  history.push({
    type: "draw",
    shapeIndex: shapes[shapes.length - 1].id,
  });

  historyIndex += 1;
};

let lastPoint: Point | null = null;
let eraseBuffer = new Set<number>();

export const startErase = (point: Point) => {
  lastPoint = point;
};

export const appendErase = (point: Point) => {
  if (lastPoint === null) {
    throw new Error("Incorrect state");
  }

  const eraseLine: Line = [lastPoint, point];

  for (const shape of shapes) {
    for (let i = 1; i < shape.points.length; i++) {
      const line: Line = [shape.points[i - 1], shape.points[i]];
      if (intersect(line, eraseLine)) {
        shape.color = "#ff00ff";
        eraseBuffer.add(shape.id);
      }
    }
  }
};

export const finishErase = () => {
  history.push({
    type: "erase",
    shapeIndices: [...eraseBuffer],
  });

  historyIndex += 1;

  for (const shape of shapes) {
    if (shape.color === "#ff00ff") {
      shape.visible = false;
      shape.color = "#000";
    }
  }
};

export const undo = () => {
  if (historyIndex >= 0) {
    const recentCommand = history[historyIndex];

    if (recentCommand.type === "draw") {
      const shape = getShape(recentCommand.shapeIndex);
      shape.visible = false;
    } else if (recentCommand.type === "erase") {
      const affected = recentCommand.shapeIndices.map((id) => getShape(id));
      for (const shape of affected) {
        shape.visible = true;
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
      shape.visible = true;
    } else if (recentCommand.type === "erase") {
      const affected = recentCommand.shapeIndices.map((id) => getShape(id));
      for (const shape of affected) {
        shape.visible = false;
      }
    }
  }
};
