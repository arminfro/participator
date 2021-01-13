import React, { ReactElement } from 'react';

interface Props {
  text?: string;
}

export default function LoadingSpinner(props: Props): ReactElement {
  return (
    <div className="ui active inverted dimmer">
      <div className="ui text loader large">
        {props.text || 'Loading data'}...
      </div>
    </div>
  );
}
