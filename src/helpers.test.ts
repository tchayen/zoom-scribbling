import {
  cameraSpaceToTile,
  clamp,
  intersect,
  screenToCameraSpace,
  translate,
  zoom,
  zoomTo,
} from "./editor/helpers";
import { Line } from "./types";

describe("clamp", () => {
  it("truncates to the specified range", () => {
    expect(clamp(120, 0, 1)).toBe(1);
  });

  it("works for close but out-of-range values", () => {
    expect(clamp(-0.0001, 0, 1)).toBe(0);
  });

  it("preserves values within the range", () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});

describe("screenToCameraSpace", () => {
  it("works", () => {
    const result = screenToCameraSpace(
      { x: 100, y: 100 },
      { x: -50, y: -50 },
      1.25
    );

    expect(result).toStrictEqual({ x: 40, y: 40 });
  });
});

describe("zoom", () => {
  it("works", () => {
    const result = zoom(-1, { x: 100, y: 100 }, { x: -50, y: -50 }, 1.25);

    expect(result).toStrictEqual({
      scale: 1.2,
      camera: {
        x: -52,
        y: -52,
      },
    });
  });
});

describe("zoomTo", () => {
  it("works", () => {
    const result = zoomTo(2, 1, { x: 100, y: 100 });
    expect(result).toStrictEqual({ scale: 1, camera: { x: 712, y: 584 } });
  });
});

describe("translate", () => {
  it("works", () => {
    const result = translate({ x: 0, y: 0 }, { x: -5, y: -5 }, 2);
    expect(result).toStrictEqual({ x: -50, y: -50 });
  });
});

describe("cameraSpaceToTile", () => {
  it("works", () => {
    const result = cameraSpaceToTile({ x: 1001, y: 123 });
    expect(result).toStrictEqual({ x: 1, y: 0 });
  });
});

describe("intersect", () => {
  it("detects typical intersection", () => {
    const a: Line = [
      { x: 1, y: 1 },
      { x: 3, y: 4 },
    ];
    const b: Line = [
      { x: 1, y: 3 },
      { x: 3, y: 1 },
    ];
    expect(intersect(a, b)).toBe(true);
  });

  it("doesn't detect two lines completely unmatching", () => {
    const a: Line = [
      { x: 1, y: 1 },
      { x: 3, y: 4 },
    ];
    const b: Line = [
      { x: 4, y: 4 },
      { x: 6, y: 2 },
    ];
    expect(intersect(a, b)).toBe(false);
  });

  it("doesn't false positive for a two parallel lines", () => {
    const a: Line = [
      { x: 1, y: 1 },
      { x: 3, y: 4 },
    ];
    const b: Line = [
      { x: 2, y: 1 },
      { x: 4, y: 4 },
    ];
    expect(intersect(a, b)).toBe(false);
  });

  it("doesn't false positive for two lines with bounding rectangles collision", () => {
    const a: Line = [
      { x: 1, y: 1 },
      { x: 5, y: 6 },
    ];
    const b: Line = [
      { x: 3, y: 3 },
      { x: 5, y: 1 },
    ];
    expect(intersect(a, b)).toBe(false);
  });

  it("works for vertical line", () => {
    const a: Line = [
      { x: 1, y: 1 },
      { x: 3, y: 4 },
    ];
    const b: Line = [
      { x: 2, y: 0 },
      { x: 2, y: 5 },
    ];
    expect(intersect(a, b)).toBe(true);
  });
});
