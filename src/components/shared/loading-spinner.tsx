import { Spin } from 'antd';
import React, { ReactElement } from 'react';

interface Props {
  text?: string;
  justSpinner?: boolean;
}

export default function LoadingSpinner(props: Props): ReactElement {
  return (
    <div
      style={{
        margin: 100,
        padding: 50,
        textAlign: 'center',
      }}
    >
      <Spin size="large" tip={props.text} />
    </div>
  );
}
