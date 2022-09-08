import dynamic from 'next/dynamic';
import { FetchProps } from './fetch';

export default function FetchDynamicImport<T>(
  props: FetchProps<T>,
): React.ReactElement {
  const Fetch = dynamic(() => import('./fetch'), {
    ssr: false,
  });
  return <Fetch {...props} />;
}
