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
  const { isMobile, layoutPadding } = useMobile();

  const layoutPaddingStyle = {
    padding: `0 ${layoutPadding.x}px ${layoutPadding.y}px`,
  };

  return (
    <Layout>
      <Layout.Header style={{ zIndex: 1, ...layoutPaddingStyle }}>
        <Navigator />
      </Layout.Header>
      <Layout style={layoutPaddingStyle}>
        <div style={{ display: 'inherit' }} ref={siderRef} />
        <Layout.Content
          style={{
            background: '#fff',
            padding: isMobile ? 8 : 24,
            margin: 0,
            minHeight: height - (65 + 30) || undefined,
          }}
        >
          <Component {...pageProps} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
