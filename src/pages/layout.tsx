import { Layout } from 'antd';
import React from 'react';
import Navigator from '../components/navigation/navigator';

interface Props {
  Component: React.FC;
  pageProps: any;
  siderRef: React.MutableRefObject<HTMLDivElement>;
}

export default function AppLayout({ Component, pageProps, siderRef }: Props) {
  return (
    <Layout>
      <Layout.Header style={{ zIndex: 1 }}>
        <Navigator />
      </Layout.Header>
      <Layout style={{ padding: '0 50px 50px' }}>
        <div style={{ display: 'inherit' }} ref={siderRef} />
        <Layout.Content
          className="site-layout-content"
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
  );
}
