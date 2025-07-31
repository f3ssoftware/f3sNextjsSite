import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';

export const useLocale = () => {
  const pathname = usePathname();

  const getLocaleFromPath = useCallback((path: string) => {
    const segments = path.split('/');
    return segments[1] || 'en';
  }, []);

  const currentLocale = useMemo(() => getLocaleFromPath(pathname), [pathname, getLocaleFromPath]);

  return {
    currentLocale,
    getLocaleFromPath
  };
}; 