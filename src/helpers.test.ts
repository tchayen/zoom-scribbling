import {
  cameraSpaceToTile,
  clamp,
  screenToCameraSpace,
  translate,
  zoom
} from "./helpers";

describe("clamp", () => {
  it("works", () => {
    expect(clamp(120, 0, 1)).toBe(1);
    expect(clamp(-0.0001, 0, 1)).toBe(0);
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
        y: -52
      }
    });
  });
});

describe("translate", () => {
  it("works", () => {
    const result = translate({ x: 0, y: 0 }, { x: -5, y: -5 });
    expect(result).toStrictEqual({ x: -5, y: -5 });
  });
});

describe("cameraSpaceToTile", () => {
  it("works", () => {
    const result = cameraSpaceToTile({ x: 1001, y: 123 });
    expect(result).toStrictEqual({ x: 1, y: 0 });
  });
});
