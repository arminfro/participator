import React, { ReactElement } from 'react';

const bodyStyle = {
  width: '100%',
  margin: 20,
  padding: 0,
  WebkitTextSizeAdjust: '100%',
  MsTextSizeAdjust: '100%',
};

export interface EmailTemplate {
  title: string;
  children: ReactElement;
}

export default function Layout({ title, children }: EmailTemplate) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body style={bodyStyle}>
        <h1>{title}</h1>
        <div>
          {children}
          <p>Participator Project</p>
        </div>
      </body>
    </html>
  );
}
