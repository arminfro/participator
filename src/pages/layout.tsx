import { Layout } from 'antd';
import React from 'react';
import Navigator from '../components/navigation/navigator';
import useWindowSize from '../components/utils/hooks/use-window-size';

interface Props {
  Component: React.FC;
  pageProps: any;
  siderRef: React.MutableRefObject<HTMLDivElement>;
}

export default function AppLayout({ Component, pageProps, siderRef }: Props) {
  const { height } = useWindowSize();

  return (
    <Layout>
      <Layout.Header style={{ zIndex: 1 }}>
        <Navigator />
      </Layout.Header>
      <Layout style={{ padding: '0 50px 30px' }}>
        <div style={{ display: 'inherit' }} ref={siderRef} />
        <Layout.Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: height - (65 + 30),
          }}
        >
          <Component {...pageProps} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
