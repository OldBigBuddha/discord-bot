const DENO_DEPLOYMENT_ID = Deno.env.get("DENO_DEPLOYMENT_ID");

/**
 * 本番環境（Deno Deploy）かそうでないかを確認する
 *
 * Deno Deploy はすべての Deployment に対して DENO_DEPLOYMENT_ID という環境変数を提供している。
 * また、Deno Deploy においては DENO_ から始まる環境変数を設定することができない。
 *
 * @see https://docs.deno.com/deploy/manual/environment-variables
 *
 * @returns 本番環境であれば true
 */
export function isProduction(): boolean {
  return DENO_DEPLOYMENT_ID != null;
}
