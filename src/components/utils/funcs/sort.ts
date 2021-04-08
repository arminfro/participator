const characterSort = <T>(t1: T, t2: T, key: string) => {
  if (t1[key] < t2[key]) return -1;
  if (t1[key] > t2[key]) return 1;
  return 0;
};

const numberAsStringSort = <T>(t1: T, t2: T, key: string) => {
  if (Number(t1[key]) < Number(t2[key])) return -1;
  if (Number(t1[key]) > Number(t2[key])) return 1;
  return 0;
};

export default function sort<T>(collection: T[], key: string) {
  const isNumbersAsStrings = collection.every(
    (el) => el[key] && typeof el[key] === 'string' && el[key].match(/^\d+$/),
  );

  return collection.sort((a, b) =>
    isNumbersAsStrings
      ? numberAsStringSort(a, b, key)
      : characterSort(a, b, key),
  );
}
