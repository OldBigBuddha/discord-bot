import { EventHandlers } from "@discordeno";

import { eventLogger } from "./logger.ts";

const logger = eventLogger.getSubLogger({ name: "ready" });

export const ready: EventHandlers["ready"] = function (_bot, payload) {
  logger.info({
    eventType: "ready",
    message: `${payload.user.username} is ready.`,
  });
};
