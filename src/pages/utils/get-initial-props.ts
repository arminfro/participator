import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { isArray, isObject, isFunction, isArguments } from 'underscore';

export default async function getInitialProps<T>(
  req: IncomingMessage,
  query: ParsedUrlQuery,
  { server, client },
): Promise<T> {
  const isServer = !!req;
  const props = await (isServer ? server(query, req) : client(query, req));
  return transformDateString(props) as T;
}

// recursive function to transform date strings to date objects
// if key is 'createdAt' or 'updatedAt'
export function transformDateString(props: any): any {
  if (isArray(props)) {
    return props.map((prop) => transformDateString(prop));
  } else if (isObject(props) && !isFunction(props) && !isArguments(props)) {
    return Object.keys(props).reduce((acc, prop) => {
      if (prop === 'createdAt' || prop === 'updatedAt') {
        acc[prop] = new Date(props[prop]);
      } else {
        acc[prop] = transformDateString(props[prop]);
      }
      return acc;
    }, {});
  } else {
    return props;
  }
}
