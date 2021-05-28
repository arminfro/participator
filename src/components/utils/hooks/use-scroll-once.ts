import { useEffect } from 'react';

export function useScrollOnceForRef(ref: React.MutableRefObject<any>) {
  useEffect(() => {
    if (ref.current) {
      window.setTimeout(() => ref.current.scrollIntoViewIfNeeded(false), 100);
    }
  }, [ref]);
}
