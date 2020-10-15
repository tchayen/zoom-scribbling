import { Action, Point, Shape } from "./types";

let ids = 1;

export const shapes: Shape[] = [];

export const history: Action[] = [];
let historyIndex = -1;

const getRecentHistoryShape = () =>
  shapes.find((shape) => shape.id === history[historyIndex].shapeIndex);

export const startShape = (point: Point) => {
  shapes.push({
    id: ids++,
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

export const undo = () => {
  if (historyIndex >= 0) {
    const shape = getRecentHistoryShape();

    if (shape) {
      shape.visible = false;
    }

    historyIndex -= 1;
  }
};

export const redo = () => {
  if (historyIndex < history.length - 1) {
    historyIndex += 1;
    const shape = getRecentHistoryShape();

    if (shape) {
      shape.visible = true;
    }
  }
};
