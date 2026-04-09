/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const result = matchMedia(query);

    if (result.matches !== value) {
      setValue(result.matches);
    }

    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query, value]);

  return value;
}
