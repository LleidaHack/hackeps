import { useEffect, useState } from "react";
import { getTheme } from "src/config/theme";

export function useSiteTheme() {
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    const sync = () => setTheme(getTheme());
    const intervalId = setInterval(sync, 30 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return theme;
}
