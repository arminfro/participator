/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from 'react';

import Navigator from './shared/navigator';
import './styles.css';

interface Props {
  Component: React.FC;
  pageProps: any;
}

export default function MyApp({ Component, pageProps }: Props): ReactElement {
  return (
    <>
      <Navigator />

      <div className="ui container">
        <Component {...pageProps} />
      </div>
    </>
  );
}
