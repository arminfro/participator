import React, { ReactElement, useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

import LoginForm from './login-form';
import { getToken } from './utils/token';
import LoadingSpinner from './shared/loading-spinner';

interface Props {
  reqUrl: string;
  status: number;
  message: string;
}

export default function HttpException({
  reqUrl,
  status,
  message,
}: Props): ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 401 && getToken()) {
      router.push(reqUrl);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner text="validate token" />;
  }

  return (
    <>
      <div className="ui statistics">
        <div className="statistic" style={{ margin: '50px auto' }}>
          <div className="value">
            <i className="exclamation icon"></i>
            {status}
          </div>
          <div className="label">
            HTTP Message:
            <div>{message}</div>
          </div>
        </div>
      </div>
      {status === 401 && <LoginForm redirectUrl={reqUrl} />}
    </>
  );
}

HttpException.getInitialProps = async ({ query }: NextPageContext) => query;

// HttpException().getInitialProps = async ({ req, query }: NextPageContext) => {
// const queryD = await getInitialProps<any>(req, query, {
// server: (query) => query,
// client: (query) => query,
// });
// return queryD;
// };
