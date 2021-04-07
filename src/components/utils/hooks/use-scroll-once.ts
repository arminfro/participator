import { useCallback, useEffect, useState } from 'react';

export function useScrollOnceForRef(ref: React.MutableRefObject<any>) {
  const [functionCalled, setFunctionCalled] = useState(false);

  const scroll = useCallback(() => {
    if (ref.current) {
      ref.current.scrollIntoViewIfNeeded({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [ref]);

  useEffect(() => {
    if (!functionCalled) {
      setTimeout(scroll);
      setFunctionCalled(true);
    }
  }, [functionCalled, setFunctionCalled, scroll]);
}
