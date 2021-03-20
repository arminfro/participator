import React, { ReactElement } from 'react';

interface Props {
  text?: string;
  justSpinner?: boolean;
}

export default function LoadingSpinner(props: Props): ReactElement {
  return (
    <div className="ui active inverted dimmer">
      <div className="ui text loader ">
        {props.justSpinner || <>{props.text || 'Loading data'}...</>}
      </div>
    </div>
  );
}
