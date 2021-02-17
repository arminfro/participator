import React, { ReactElement } from 'react'
import Link from '../../types/link';

interface Props {
    link: Link;
    key: number

}
export default function ChatLink({ link, key }: Props): ReactElement {
    return (
        <div key={key} className="metadata">
            <a className="avatar" href={link.url}>
                <img src={link.imgUrl} width="100" height="100" />
            </a>
            <a className="metadata" href={link.url}>
                <p><b>{link.title}</b></p> <br />
                {link.description}
            </a>
        </div>
    )
}
