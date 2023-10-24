const DENO_ENV = Deno.env.get("DENO_ENV");

/**
 * 本番環境かそうでないかを確認する
 * @returns 本番環境であれば true
 */
export function isProduction(): boolean {
  return DENO_ENV === "production";
}
