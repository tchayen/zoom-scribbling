import { useEffect, useState } from "react";

const useOnlyOneTab = () => {
  // TODO:
  // - fix it (doesn't work; sometimes it just counts refreshes, sometimes no
  //   idea what it does).
  const [openTabs, setOpenTabs] = useState(1);
  const KEY = "openTabs";

  const handleLoad = () => {
    const value = localStorage.getItem(KEY);
    if (value) {
      setOpenTabs(Number(value) + 1);
      localStorage.setItem(KEY, openTabs.toString());
    } else {
      localStorage.setItem(KEY, "1");
    }
    console.log("handleLoad", { openTabs });
  };

  const handleUnload = (event: any) => {
    event.preventDefault();

    const value = localStorage.getItem(KEY);
    if (value) {
      setOpenTabs(Number(value) - 1);
      localStorage.setItem(KEY, openTabs.toString());
    }
    event.returnValue = "";
  };

  const handleStorage = () => {
    const value = localStorage.getItem(KEY);

    if (value) {
      const asNumber = Number(value);

      if (asNumber !== openTabs) {
        setOpenTabs(asNumber);
        console.log("handleStorage", { openTabs });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("load", handleLoad);
    window.addEventListener("unload", handleUnload);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("storage", handleStorage);
    };
  });

  return openTabs;
};

export default useOnlyOneTab;
