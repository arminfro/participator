import React, { ReactElement } from 'react';
import { SWRConfig } from 'swr';
import { ToastContainer } from 'react-toastify';

import Navigator from '../components/navigation/navigator';
import { AbilityContextProvider } from '../components/utils/casl-context';
import StoreProvider from '../components/utils/store/provider';
import { swrApi } from '../components/utils/api';
import './styles.css';

interface Props {
  Component: React.FC;
  pageProps: any;
}

export default function App({ Component, pageProps }: Props): ReactElement {
  const swrOptions = {
    fetcher: (resource, init) => swrApi('get', resource),
    suspense: true,
  };

  return (
    <StoreProvider>
      <AbilityContextProvider>
        <Navigator />
        <SWRConfig value={swrOptions}>
          <div className="ui container">
            <Component {...pageProps} />
          </div>
        </SWRConfig>
      </AbilityContextProvider>
      <ToastContainer />
    </StoreProvider>
  );
}
