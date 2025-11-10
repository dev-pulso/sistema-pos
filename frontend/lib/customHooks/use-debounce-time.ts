import { useEffect, useRef, useState } from "react";

interface UseDebounceOptions {
  delay?: number;
  value: string;
}

const useDebounce = ({value, delay = 500}:UseDebounceOptions) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set a timeout to update the debounced value
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value or delay changes
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
};

export default useDebounce;
