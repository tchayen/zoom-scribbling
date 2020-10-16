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
  it("erase marks shape as erased and then invisible", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    startErase({ x: 10, y: 0 });
    appendErase({ x: 0, y: 10 });

    expect(__TEST_ONLY__.shapes[0].state).toBe("erased");

    finishErase();

    expect(__TEST_ONLY__.history).toHaveLength(2);

    expect(__TEST_ONLY__.shapes[0].state).toBe("invisible");
  });

  it("erasing previously erased shape does nothing", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    startErase({ x: 0, y: 5 });
    appendErase({ x: 10, y: 5 });

    expect(__TEST_ONLY__.shapes[0].state).toBe("erased");

    finishErase();

    startErase({ x: 0, y: 5 });
    appendErase({ x: 10, y: 5 });

    expect(__TEST_ONLY__.shapes[0].state).toBe("invisible");
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
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    undo();
    expect(__TEST_ONLY__.shapes).toHaveLength(0);
    expect(__TEST_ONLY__.history).toHaveLength(0);
  });

  it("after erasing two shapes restores both of them", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    startShape({ x: 10, y: 0 });
    appendLine({ x: 20, y: 10 });
    finishShape();

    startErase({ x: 0, y: 5 });
    appendErase({ x: 20, y: 5 });
    finishErase();

    expect(__TEST_ONLY__.shapes).toHaveLength(2);
    expect(__TEST_ONLY__.shapes[0].state).toBe("invisible");
    expect(__TEST_ONLY__.shapes[1].state).toBe("invisible");

    undo();

    expect(__TEST_ONLY__.shapes[0].state).toBe("visible");
    expect(__TEST_ONLY__.shapes[1].state).toBe("visible");
  });

  it("while erasing leaves the shape intact also without changing the history", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    startErase({ x: 0, y: 5 });
    appendErase({ x: 20, y: 5 });

    undo();

    expect(__TEST_ONLY__.shapes[0].state).toBe("visible");
  });
});

describe("redo", () => {
  it("sets shape as visible", () => {
    startShape({ x: 0, y: 0 });
    appendLine({ x: 10, y: 10 });
    finishShape();

    undo();

    expect(__TEST_ONLY__.shapes[0].state).toBe("invisible");

    redo();

    expect(__TEST_ONLY__.shapes[0].state).toBe("visible");
  });
});
