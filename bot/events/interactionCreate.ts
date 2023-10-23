import { EventHandlers } from "@discordeno";

import { runCommandMap } from "../commands/index.ts";

export const interactionCreate: EventHandlers["interactionCreate"] =
  async function (bot, interaction) {
    if (interaction.data == null) {
      throw new Error("No data in interactioin request");
    }

    const commandName = interaction.data.name;
    const runCommand = runCommandMap.get(commandName);

    if (runCommand == null) {
      // 存在しないコマンド
      throw new Error("non-existent command request");
    }

    await runCommand(bot, interaction);
  };
