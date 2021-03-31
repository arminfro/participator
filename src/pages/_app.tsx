import { Breadcrumb, Layout, Menu } from 'antd';
import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';
import Navigator from '../components/navigation/navigator';
import { swrApi } from '../components/utils/api';
import { AbilityContextProvider } from '../components/utils/casl-context';
import StoreProvider from '../components/utils/store/provider';
import './styles.css';

interface Props {
  Component: React.FC;
  pageProps: any;
}

export default function App({ Component, pageProps }: Props): ReactElement {
  const swrOptions = {
    fetcher: (url: string) => swrApi(url),
    suspense: true,
  };

  return (
    <StoreProvider>
      <AbilityContextProvider>
        <SWRConfig value={swrOptions}>
          <Layout>
            <Navigator />
            <Layout style={{ padding: '0 24px 24px' }}>
              <Layout.Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 480,
                }}
              >
                <Component {...pageProps} />
              </Layout.Content>
            </Layout>
          </Layout>
        </SWRConfig>
      </AbilityContextProvider>
      <ToastContainer />
    </StoreProvider>
  );
}
