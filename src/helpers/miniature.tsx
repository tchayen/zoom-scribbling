import { readFromDb, saveToDb } from "./indexedDb";

const asBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result === null) {
        reject();
      } else {
        resolve(result);
      }
    });
  });

export const generateMiniature = async (canvas: HTMLCanvasElement) => {
  const blob = await asBlob(canvas);
  const id = await saveToDb(blob);
  const miniature = await readFromDb(id);

  const img = document.createElement("img");
  const url = URL.createObjectURL(miniature);
  img.src = url;

  img.style.position = "absolute";
  img.style.zIndex = "10";
  img.style.top = "0px";
  img.style.left = "0px";
  img.width = canvas.width / 6;
  img.height = canvas.height / 6;
  img.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.25)";

  document.body.appendChild(img);
};
