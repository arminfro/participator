import {
  CameraOutlined,
  CodeOutlined,
  ExperimentOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons';
import { Alert, Col, Row } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';
import Page from '../components/utils/container/page';

export default function LandingPage(): ReactElement {
  const styles: Record<string, CSSProperties> = {
    h1: { textAlign: 'center', fontSize: 24 },
    icon: { padding: 8, fontSize: 50, display: 'block' },
    col: { padding: 12, textAlign: 'center', margin: 'auto' },
    alert: { textAlign: 'center', maxWidth: 600, margin: '8px auto' },
  };

  return (
    <Page title="Home">
      <h1 style={styles.h1}>Welcome to Next.js on Nest.js</h1>
      <Alert
        style={styles.alert}
        message="Disclaimer: This is just a demo instance, any data you input will be deleted soon."
        type="warning"
      />
      <Alert
        style={styles.alert}
        message="Status: Alpha, watch out there're bugs. Reload if something looks broken."
        type="error"
      />
      <Row style={{ maxWidth: 400, margin: '50px auto' }}>
        <Col style={styles.col} span={12}>
          <ExperimentOutlined style={styles.icon} />
          Prototyping
        </Col>
        <Col style={styles.col} span={12}>
          <VerticalAlignMiddleOutlined style={styles.icon} />
          Testing
        </Col>
        <Col style={styles.col} span={12}>
          <CodeOutlined style={styles.icon} />
          DX - Developer expierence
        </Col>
        <Col style={styles.col} span={12}>
          <CameraOutlined style={styles.icon} />
          Showcase
        </Col>
      </Row>
    </Page>
  );
}
