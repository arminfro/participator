import { isArray, isObject, isFunction, isArguments } from 'underscore';

type Keys<T> = keyof T;
type Values<T> = T[Keys<T>];
type AnyObject<T> = Record<Keys<T>, Values<T>>;

// recursive function to transform values in objects
// if condition func returns true, operation func will be called
// todo, type return value
export default function transformTree<T, K>(
  props: AnyObject<T>,
  condition: (propKey: Keys<T>, propValue: Values<T>) => boolean,
  operation: (propValue: Values<T>) => K,
) {
  if (isArray(props)) {
    return props.map((prop) => transformTree<T, K>(prop, condition, operation));
  } else if (isObjectAndNothingElse(props)) {
    return Object.keys(props).reduce((acc, prop) => {
      if (condition(prop as Keys<T>, props[prop])) {
        acc[prop] = operation(props[prop]);
      } else {
        acc[prop] = transformTree<T, K>(props[prop], condition, operation);
      }
      return acc;
    }, {} as T);
  } else {
    return props;
  }
}

function isObjectAndNothingElse<T>(val: AnyObject<T>): boolean {
  return isObject(val) && !isFunction(val) && !isArguments(val);
}

export function transformDateString<T>(props: T) {
  return transformTree<T, Date>(
    props,
    (prop) => prop === 'createdAt' || prop === 'updatedAt',
    (val) => new Date((<unknown>val) as string),
  );
}
