import { curveToBezier } from "points-on-curve/lib/curve-to-bezier";
import { pointsOnBezierCurves } from "points-on-curve";
import {
  getRectangle,
  intersect,
  rectangleContains,
  subtractPoints,
} from "./math";
import { Action, EditorState, Line, Point, Shape } from "../types";

// Debug measurement of number of points saved by simplifying.
export let __original = 0;
export let __simplified = 0;

let ids = 1;

export const shapes: Shape[] = [];

export const history: Action[] = [];
let historyIndex = -1;

let drawing = false;
let erasing = false;

let lastPoint: Point | null = null;
let eraseBuffer = new Set<number>();

export let selection: { start: Point; end: Point } | null = null;
export const selectedIndices: number[] = [];
let previousSelectionPoint: Point | null = null;

const updateClosingGuard = () => {
  return;

  const unsafe = shapes
    .map((shape) => shape.state !== "invisible")
    .reduce((a, b) => a || b, false);

  if (unsafe) {
    window.onbeforeunload = () => {
      return true;
    };
  } else {
    window.onbeforeunload = null;
  }
};

export const reset = () => {
  ids = 1;

  shapes.splice(0, shapes.length);

  history.splice(0, shapes.length);
  historyIndex = -1;

  drawing = false;
  erasing = false;

  lastPoint = null;
  eraseBuffer = new Set<number>();

  __original = 0;
  __simplified = 0;

  updateClosingGuard();
};

const getShape = (id: number) => {
  const shape = shapes.find((shape) => shape.id === id);
  if (!shape) {
    throw new Error("Shape not found");
  }
  return shape;
};

export const startShape = (point: Point, thickness: number, color: string) => {
  drawing = true;
  shapes.push({
    id: ids++,
    color,
    points: [point],
    thickness,
    state: "visible",
    simplified: null,
  });

  history.splice(historyIndex + 1, history.length - historyIndex - 1);
};

export const appendLine = (point: Point) => {
  if (!drawing) {
    return;
  }

  shapes[shapes.length - 1].points.push(point);
};

export const finishShape = (smoothing: boolean) => {
  if (!drawing) {
    return;
  }

  const latest = shapes[shapes.length - 1];

  history.push({
    type: "draw",
    shapeIndex: latest.id,
  });

  console.log(smoothing);

  if (smoothing && latest.points.length >= 3) {
    const config = [1, 0.5];
    const curves = curveToBezier(latest.points.map(({ x, y }) => [x, y]));
    latest.simplified = pointsOnBezierCurves(
      curves,
      ...config
    ).map(([x, y]) => ({ x, y }));

    __original += latest.points.length;
    __simplified +=
      latest.points.length >= 3
        ? latest.simplified.length
        : latest.points.length;
  }

  historyIndex += 1;
  drawing = false;
  updateClosingGuard();
};

export const startSelection = (point: Point) => {
  selection = { start: point, end: point };
};

export const updateSelection = (point: Point) => {
  if (selection === null) {
    throw new Error("Selection not started");
  }

  selection.end = point;
};

export const finishSelection = () => {
  if (selection === null) {
    throw new Error("Selection unavailable");
  }

  for (const shape of shapes) {
    if (shape.state === "selected") {
      shape.state = "visible";
    }
  }

  const rectangle = getRectangle(selection.start, selection.end);

  for (const shape of shapes) {
    if (shape.state !== "visible") {
      continue;
    }

    const contained = shape.points.some((point) =>
      rectangleContains(point, rectangle)
    );

    if (contained) {
      shape.state = "selected";
    }
  }
};

export const removeSelection = () => {
  const removed: number[] = [];

  for (const shape of shapes) {
    if (shape.state === "selected") {
      shape.state = "invisible";
      removed.push(shape.id);
    }
  }

  history.push({
    type: "erase",
    shapeIndices: removed,
  });
  historyIndex += 1;

  selection = null;
};

export const startSelectionMove = (point: Point) => {
  previousSelectionPoint = point;
};

export const updateSelectionMove = (point: Point) => {
  if (selection === null) {
    throw new Error("Selection is null");
  }

  if (previousSelectionPoint === null) {
    throw new Error("No previous selection point");
  }

  const delta = subtractPoints(point, previousSelectionPoint);

  for (const shape of shapes) {
    if (shape.state === "selected") {
      for (const point of shape.points) {
        point.x += delta.x;
        point.y += delta.y;
      }

      if (shape.simplified) {
        for (const point of shape.simplified) {
          point.x += delta.x;
          point.y += delta.y;
        }
      }
    }
  }

  selection.start.x += delta.x;
  selection.start.y += delta.y;
  selection.end.x += delta.x;
  selection.end.y += delta.y;

  previousSelectionPoint = point;
};

export const finishSelectionMove = () => {
  previousSelectionPoint = null;
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
  eraseBuffer.clear();

  historyIndex += 1;

  for (const shape of shapes) {
    if (shape.state === "erased") {
      shape.state = "invisible";
    }
  }

  erasing = false;
  updateClosingGuard();
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
  updateClosingGuard();
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
  updateClosingGuard();
};

export const exportState = () => {
  return JSON.stringify({
    shapes,
    history,
    historyIndex,
  });
};

export const importState = (state: EditorState) => {
  reset();

  shapes.push(...state.shapes);
  history.push(...state.history);
  historyIndex = state.historyIndex;
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
