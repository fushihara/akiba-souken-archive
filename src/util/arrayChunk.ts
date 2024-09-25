export function chunk<T = any>(list: T[], len: number) {
  if (len <= 0) {
    throw new Error();
  }
  const result: T[][] = [];
  for (let i = 0; i < list.length; i += len) {
    result.push(list.slice(i, i + len));
  }
  return result;
}