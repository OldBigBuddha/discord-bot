import type { EventHandlers } from "@discordeno";
import { ready } from "./ready.ts";
import { interactionCreate } from "./interactionCreate.ts";

export const events: Partial<EventHandlers> = {
  ready,
  interactionCreate,
};
