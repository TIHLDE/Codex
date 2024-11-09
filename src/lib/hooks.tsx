'use client';

import { useEffect, useState } from 'react';

export const useDebounce = <Type extends unknown>(
  value: Type,
  delay: number,
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
