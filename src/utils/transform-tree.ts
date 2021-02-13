import { isArray, isObject, isFunction, isArguments, isDate } from 'underscore';

type Keys<T> = keyof T & 'id';
type Values<T> = T[Keys<T>];
type AnyObject<T> = Record<Keys<T>, Values<T>>;
type AnyObjectWithId<T> = AnyObject<T>;

// recursive function to transform values in objects
// if condition func returns true, operation func will be called
// todo, type return value
export default function transformTree<T, K>(
  props: AnyObjectWithId<T> | AnyObjectWithId<T>[],
  condition: (
    propKey: Keys<T>,
    propValue: Values<T>,
    object: AnyObjectWithId<T>,
  ) => boolean,
  operation: (
    propKey: Keys<T>,
    propValue: Values<T>,
    object: AnyObjectWithId<T>,
  ) => K,
  mergeObjIntoObj: T | null = null,
  objToRemove: T | null = null,
) {
  if (isArray(props)) {
    return props
      .map((prop) => {
        if (!(objToRemove && condition(null, null, prop))) {
          return transformTree<T, K>(
            prop,
            condition,
            operation,
            mergeObjIntoObj,
            objToRemove,
          );
        }
      })
      .filter((a) => a);
  } else if (isObjectAndNothingElse(props)) {
    return Object.keys(props).reduce((acc, prop) => {
      if (condition(prop as Keys<T>, props[prop], props)) {
        if (operation) {
          acc[prop] = operation(prop as Keys<T>, props[prop], props);
        } else if (mergeObjIntoObj) {
          acc[prop] = props[prop];
          acc = { ...acc, ...mergeObjIntoObj };
        }
      } else {
        acc[prop] = transformTree<T, K>(
          props[prop],
          condition,
          operation,
          mergeObjIntoObj,
          objToRemove,
        );
      }
      return acc;
    }, {} as T);
  } else {
    return props;
  }
}

function isObjectAndNothingElse<T>(val: AnyObjectWithId<T>): boolean {
  return isObject(val) && !isDate(val) && !isFunction(val) && !isArguments(val);
}

export function transformDateString<T extends { id: number }>(
  props: T | T[],
): T[] {
  return transformTree<T, Date>(
    props,
    (key: Keys<T>) => key === 'createdAt' || key === 'updatedAt',
    (_key: Keys<T>, val: Values<T>): Date => new Date(val),
  );
}

export function replaceInObjById<T extends { id: number }>(
  tree: T[],
  replaceObj: AnyObjectWithId<T>,
): T[] {
  return transformTree(
    tree,
    (_key: Keys<T>, _val: Values<T>, obj: T) => obj.id === replaceObj.id,
    (key: Keys<T>) => replaceObj[key],
  );
}

export function addToPropArrayById<T extends { id: number }>(
  tree: T[],
  keyForId: string,
  keyToTransform: string,
  valueToAdd: T,
): T[] {
  return transformTree(
    tree,
    (key: Keys<T>, _val: Values<T>, obj: T) =>
      obj.id === valueToAdd[keyForId].id && key === keyToTransform,
    (_key: Keys<T>, value: Values<any>) => [...value, valueToAdd],
  );
}

export function mergeObjsById<T extends { id: number }>(
  tree: T,
  id: number,
  keyToAdd: string,
  valueToAdd: any,
): T {
  return transformTree(
    tree,
    (_key: Keys<T>, _val: Values<T>, obj: T) =>
      obj.id === id && !Object.keys(obj).includes(keyToAdd),
    null,
    { [keyToAdd]: valueToAdd } as Partial<T>,
  );
}

export function removeObjFromArrayById<T extends { id: number }>(
  id: number,
  tree: T[],
): T[] {
  return transformTree(
    tree,
    (_key: Keys<T>, _val: Values<T>, obj: AnyObjectWithId<T>) => obj.id === id,
    () => {
      /* */
    },
    null,
    { id },
  );
}
