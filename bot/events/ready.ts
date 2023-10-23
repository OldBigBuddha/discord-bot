import { EventHandlers } from "@discordeno";

// deno-lint-ignore require-await
export const ready: EventHandlers["ready"] = async function (_bot, payload) {
  console.log(`[READY]${payload.user.username} is ready.`);
};
