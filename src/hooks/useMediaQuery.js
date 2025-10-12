import { useEffect, useState } from "react";
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener?.("change", onChange) || m.addListener(onChange);
    return () =>
      m.removeEventListener?.("change", onChange) || m.removeListener(onChange);
  }, [query]);
  return matches;
}
