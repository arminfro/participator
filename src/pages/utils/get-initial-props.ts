import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { transformDateString } from '../../utils/transform-tree';

export default async function getInitialProps<T>(
  req: IncomingMessage,
  query: ParsedUrlQuery,
  { server, client },
): Promise<T> {
  const isServer = !!req;
  const props = await (isServer
    ? server(query, req)
    : client(query, req).catch(() => {
        // quick fix, todo, use swr instead of getInitialProps
        window.location.href = '/';
      }));
  return transformDateString(props) as T;
}
