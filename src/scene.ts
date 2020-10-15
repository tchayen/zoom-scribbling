import { Action, Point, Shape } from "./types";

let ids = 1;

export const shapes: Shape[] = [];

export const history: Action[] = [];
let historyIndex = -1;

const getRecentHistoryShape = (id: number) =>
  shapes.find((shape) => shape.id === id);

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

export const undo = () => {
  if (historyIndex >= 0) {
    const recentCommand = history[historyIndex];
    const shape = getRecentHistoryShape(recentCommand.shapeIndex);

    if (!shape) {
      throw new Error(
        `Incorrect history. Shape with id '${recentCommand.shapeIndex}' does not exist.`
      );
    }

    if (recentCommand.type === "draw") {
      shape.visible = false;
    } else if (recentCommand.type === "erase") {
      shape.visible = true;
    }

    historyIndex -= 1;
  }
};

export const redo = () => {
  if (historyIndex < history.length - 1) {
    historyIndex += 1;
    const recentCommand = history[historyIndex];
    const shape = getRecentHistoryShape(recentCommand.shapeIndex);

    if (!shape) {
      throw new Error(
        `Incorrect history. Shape with id '${recentCommand.shapeIndex}' does not exist.`
      );
    }

    if (recentCommand.type === "draw") {
      shape.visible = true;
    } else if (recentCommand.type === "erase") {
      shape.visible = false;
    }
  }
};
