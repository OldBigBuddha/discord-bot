import { Logger } from "tslog";

import { isProduction } from "@utils/env";

function calcMinLevel(): number {
  // https://tslog.js.org/#/?id=default-log-level
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
