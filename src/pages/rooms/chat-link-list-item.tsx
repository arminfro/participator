import React, { ReactElement } from 'react';
import Link from '../../types/link';

interface Props {
  link: Link;
}
export default function ChatLinkListItem({ link }: Props): ReactElement {
  return (
    <div className="item">
      <a href={link.url}>
        {link.imgUrl && <img className="ui avatar image" src={link.imgUrl} />}
        <b>{link.title}</b>
      </a>
    </div>
  );
}
