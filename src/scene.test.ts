import {
  redo,
  undo,
  shapes,
  startShape,
  finishShape,
  appendLine,
  appendErase,
  finishErase,
  startErase,
  __TEST_ONLY__,
} from "./scene";

beforeEach(() => {
  __TEST_ONLY__.reset();
});

describe("draw", () => {
  it("saves drawing to shapes", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    expect(__TEST_ONLY__.history).toHaveLength(1);
  });

  it("after undo resets further history", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    undo();

    startShape({ x: 0, y: 0 });

    expect(__TEST_ONLY__.history).toHaveLength(0);
  });
});

describe("erase", () => {
  it("erase marks shape as pink and then invisible", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    startErase({ x: 10, y: 0 });
    appendErase({ x: 0, y: 10 });

    expect(__TEST_ONLY__.shapes[0].color).toBe("#ff00ff");
    expect(__TEST_ONLY__.shapes[0].state).toBe("erased");

    finishErase();

    expect(__TEST_ONLY__.history).toHaveLength(2);

    expect(__TEST_ONLY__.shapes[0].color).toBe("#000");
    expect(__TEST_ONLY__.shapes[0].state).toBe("invisible");
  });

  it("erasing previously erased shape does nothing", () => {
    // TODO
  });
});

describe("undo", () => {
  it("sets shape as not visible", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    undo();

    expect(__TEST_ONLY__.shapes[0].state).toBe("invisible");
  });

  it("while drawing resets the drawn shape without changing the history", () => {
    // TODO
  });

  it("after erasing two shapes restores both of them", () => {
    // TODO
  });

  it("of an erase restores shape", () => {
    // TODO
  });

  it("while erasing leaves the shape intact also without changing the history", () => {
    // TODO
  });
});

describe("redo", () => {
  it("sets shape as visible", () => {
    // TODO
  });
});
