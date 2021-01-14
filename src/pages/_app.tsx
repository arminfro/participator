/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from 'react';

import Navigator from './navigation/navigator';
import './styles.css';
import StoreProvider from './utils/store/provider';

interface Props {
  Component: React.FC;
  pageProps: any;
}

export default function MyApp({ Component, pageProps }: Props): ReactElement {
  return (
    <StoreProvider>
      <Navigator />

      <div className="ui container">
        <Component {...pageProps} />
      </div>
    </StoreProvider>
  );
}
