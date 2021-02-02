import React, { ReactElement } from 'react';

import Navigator from './navigation/navigator';
import { AbilityContextProvider } from './utils/casl-context';
import StoreProvider from './utils/store/provider';
import './styles.css';

interface Props {
  Component: React.FC;
  pageProps: any;
}

export default function MyApp({ Component, pageProps }: Props): ReactElement {
  return (
    <StoreProvider>
      <AbilityContextProvider>
        <Navigator />

        <div className="ui container">
          <Component {...pageProps} />
        </div>
      </AbilityContextProvider>
    </StoreProvider>
  );
}
