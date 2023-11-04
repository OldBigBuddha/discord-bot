/**
 * ダイスを振る
 * @param max ダイスの最大値
 * @param quantity ダイスの個数
 * @returns 結果
 */
export function dice(max: number, quantity: number): number[] {
  const values = [];
  for (let i = 0; i < quantity; i++) {
    const v = getRandomInt(max);
    values.push(v);
  }
  return values;
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max) + 1; //The maximum is inclusive
}
