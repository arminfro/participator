import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import transformTree, { transformDateString } from './transform-tree';

export default async function getInitialProps<T>(
  req: IncomingMessage,
  query: ParsedUrlQuery,
  { server, client },
): Promise<T> {
  const isServer = !!req;
  const props = await (isServer ? server(query, req) : client(query, req));
  return transformDateString(props) as T;
}
