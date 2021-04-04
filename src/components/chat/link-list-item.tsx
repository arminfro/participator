import { Avatar, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { ReactElement } from 'react';
import Link from '../../types/link';

interface Props {
  link: Link;
}

export default function ChatLinkListItem({ link }: Props): ReactElement {
  return (
    <Card size="small" style={{ flex: '0 0 auto', height: '8em' }}>
      <a target="_blank" rel="noopener noreferrer" href={link.url}>
        <Meta
          style={{ maxWidth: '18em' }}
          avatar={link.imgUrl && <Avatar size="small" src={link.imgUrl} />}
          title={link.title}
          description={
            <span>
              {`${link.description.substring(0, 72)}${
                link.description.length > 72 && '...'
              }`}
            </span>
          }
        />
      </a>
    </Card>
  );
}
