import { add } from 'date-fns';
import React, { ReactElement } from 'react';
import Layout from './layout';

interface Props {
  email: string;
  url: string;
}

export default function PasswordReset(
  props: Props,
): { subject: string; body: ReactElement } {
  const subject = `Password recovery for Participator`;
  return {
    subject,
    body: (
      <Layout title={subject}>
        <>
          <div>
            <p>This E-Mail helps you to recover your password.</p>
            <p>Follow the link to set a new password.</p>
            <a target="_blank" rel="noreferrer" href={props.url}>
              {props.url}
              <br />
              <button>Reset Password</button>
            </a>
          </div>
          <br />
          <div>
            <small>
              The link will be invalid after one hour, at{' '}
              {/* todo, read and save users locale, for this call */}
              {add(new Date(), { hours: 1 }).toLocaleTimeString()}{' '}
            </small>
          </div>
        </>
      </Layout>
    ),
  };
}
