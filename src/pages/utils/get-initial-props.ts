import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { transformDateString } from '../../utils/transform-tree';

export default async function getInitialProps<T>(
  req: IncomingMessage,
  query: ParsedUrlQuery,
  { server, client },
  childrenPropertyNames: string[] = null,
): Promise<T> {
  const isServer = !!req;
  let props = await (isServer ? server(query, req) : client(query, req));
  if (childrenPropertyNames) {
    childrenPropertyNames.forEach((childrenPropertyName) => {
      props = transformDateString(props, childrenPropertyName);
    });
  } else {
    props = transformDateString(props);
  }
  return props;
}
