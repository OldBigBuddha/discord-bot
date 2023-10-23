import { EventHandlers } from "@discordeno";

import { runCommandMap } from "../commands/index.ts";
import { eventLogger } from "./logger.ts";

const logger = eventLogger.getSubLogger({ name: "interactionCreate" });

export const interactionCreate: EventHandlers["interactionCreate"] =
  async function (bot, interaction) {
    if (interaction.data == null) {
      const e = new Error("No data in interactioin request");
      logger.error({
        eventType: "interactionCreate",
        error: e,
        interaction: interaction,
      });
      throw e;
    }

    const commandName = interaction.data.name;
    const runCommand = runCommandMap.get(commandName);

    if (runCommand == null) {
      // 存在しないコマンド
      const e = new Error("non-existent command request");
      logger.error({
        eventType: "interactionCreate",
        error: e,
        interaction: interaction,
      });
      throw e;
    }

    await runCommand(bot, interaction);
  };
