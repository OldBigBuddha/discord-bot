import { createBot } from "@discordeno";

import { Secret } from "@utils/secret";

import { slashCommandMap } from "./commands/index.ts";
import { events } from "./events/index.ts";

export const BOT = createBot({
  token: Secret.DISCORD_TOKEN,
  events: events,
});

// コマンド登録
for (const command of slashCommandMap) {
  await BOT.helpers.createGuildApplicationCommand(command, Secret.GUILD_ID);
}
await BOT.helpers.upsertGuildApplicationCommands(
  Secret.GUILD_ID,
  slashCommandMap,
);
