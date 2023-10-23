import { Logger } from "tslog";

const DENO_ENV = Deno.env.get("DENO_ENV");

function isProduction(): boolean {
  return DENO_ENV === "production";
}

function calcMinLevel(): number {
  if (isProduction()) {
    return 3; // info
  }

  return 1; // silly
}

export const botLogger = new Logger({
  name: "bot",
  minLevel: calcMinLevel(),
  type: isProduction() ? "json" : "pretty",
});
