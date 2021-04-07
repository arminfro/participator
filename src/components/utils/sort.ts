const characterSort = <T>(answer1: T, answer2: T, key: string) => {
  if (answer1[key] < answer2[key]) return -1;
  if (answer1[key] > answer2[key]) return 1;
  return 0;
};

const numberAsStringSort = <T>(answer1: T, answer2: T, key: string) => {
  console.log('NUMS!');
  if (Number(answer1[key]) < Number(answer2[key])) return -1;
  if (Number(answer1[key]) > Number(answer2[key])) return 1;
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
