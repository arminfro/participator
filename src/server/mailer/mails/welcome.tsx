import React, { ReactElement } from 'react';
import Layout from './layout';

interface Props {
  name: string;
}

export default function Welcome(
  props: Props,
): { subject: string; body: ReactElement } {
  const subject = `Welcome ${props.name} to Participator`;
  return {
    subject,
    body: (
      <Layout title={subject}>
        <div>
          <p>Thanks for joining participator.</p>
        </div>
      </Layout>
    ),
  };
}
