import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';

export default async function getInitialProps<T>(
  req: IncomingMessage,
  query: ParsedUrlQuery,
  { server, client },
): Promise<T> {
  const isServer = !!req;
  return await (isServer ? server(query, req) : client(query, req));
}
