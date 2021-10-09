import { Col, Row, Statistic } from 'antd';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import LoadingSpinner from '../components/shared/loading-spinner';
import Page from '../components/utils/container/page';
import { getToken } from '../components/utils/funcs/token';

interface Props {
  path: string;
  status: string;
  message: string;
}

export default function Exception({
  path,
  status,
  message,
}: Props): ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (+status === 401 && getToken() && !path.match(/^\/api*/)) {
      router.push(path);
    } else {
      setLoading(false);
    }
  }, [path, router, status]);

  if (loading) {
    return <LoadingSpinner text="validate token" />;
  }

  return (
    <>
      <Page title={`Exception Page`}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Http Status Code" value={status} />
          </Col>
          <Col span={8}>
            <Statistic title="Message" value={message} />
          </Col>
          <Col span={8}>
            <Statistic title="Path" value={path} />
          </Col>
        </Row>
      </Page>
    </>
  );
}

Exception.getInitialProps = async ({ query }: NextPageContext & Props) => query;
