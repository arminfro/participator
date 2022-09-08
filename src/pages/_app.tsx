// import '../../scripts/wdyr';
import React, { ReactElement, useRef } from 'react';
import { SWRConfig } from 'swr';
import { AbilityContextProvider } from '../components/utils/context/casl-context';
import CurrentUserProvider from '../components/utils/context/current-user';
import { SiderRefProvider } from '../components/utils/context/sider-ref-context';
import { swrApi } from '../components/utils/funcs/api';
import Layout from '../components/layout';
import './styles.css';

interface Props {
  Component: React.FC;
  pageProps: any;
}

export default function App({ Component, pageProps }: Props): ReactElement {
  const siderRef = useRef<HTMLDivElement>(null);

  const swrOptions = {
    fetcher: (url: string) => swrApi(url),
    suspense: true,
  };

  return (
    <CurrentUserProvider>
      <AbilityContextProvider>
        <SiderRefProvider siderRef={siderRef}>
          <SWRConfig value={swrOptions}>
            <Layout
              Component={Component}
              pageProps={pageProps}
              siderRef={siderRef}
            />
          </SWRConfig>
        </SiderRefProvider>
      </AbilityContextProvider>
    </CurrentUserProvider>
  );
}
