import { Layout } from 'antd';
import React from 'react';
import Navigator from '../components/navigation/navigator';
import useWindowSize from '../components/utils/hooks/use-window-size';
import useMobile from './utils/hooks/use-mobile';

interface Props {
  Component: React.FC;
  pageProps: any;
  siderRef: React.MutableRefObject<HTMLDivElement>;
}

export default function AppLayout({ Component, pageProps, siderRef }: Props) {
  const { height } = useWindowSize();
  const { layoutPadding } = useMobile();

  return (
    <Layout>
      <Layout.Header className="layout-padding" style={{ zIndex: 1 }}>
        <Navigator />
      </Layout.Header>
      <Layout className="layout-padding">
        <div style={{ display: 'inherit' }} ref={siderRef} />
        <Layout.Content
          className="layout-content-padding"
          style={{
            background: '#fff',
            margin: 0,
            minHeight: height - (65 + layoutPadding.y) || undefined,
          }}
        >
          <Component {...pageProps} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
