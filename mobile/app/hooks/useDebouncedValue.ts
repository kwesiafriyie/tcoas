import { useEffect, useState } from 'react';

// Mirrors the web dashboard's own 350ms search debounce -- avoids firing a
// request on every keystroke while typing in the search box.
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
