export let db: IDBDatabase;

export const setupIndexedDb = () => {
  const request = indexedDB.open("db", 1);
  request.onerror = () => {
    throw new Error("Failed to start IndexedDB");
  };

  request.onsuccess = () => {
    db = request.result;
  };

  request.onupgradeneeded = () => {
    db.createObjectStore("miniatures", { keyPath: "id", autoIncrement: true });
  };
};

export const saveToDb = (blob: Blob) =>
  new Promise<number>((resolve, reject) => {
    const transaction = db.transaction(["miniatures"], "readwrite");
    const request = transaction.objectStore("miniatures").add(blob);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      const id = request.result;
      resolve(Number(id.toString()));
    };
  });

export const readFromDb = (id: number) =>
  new Promise<Blob>((resolve, reject) => {
    const transaction = db.transaction(["miniatures"], "readonly");
    const request = transaction.objectStore("miniatures").get(id);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });

setupIndexedDb();
