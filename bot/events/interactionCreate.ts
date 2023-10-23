import { EventHandlers } from "@discordeno";

import { runCommandMap } from "../commands/index.ts";
import { eventLogger } from "./logger.ts";
import { sendCustomInteractionErrorResponse } from "../helpers/errorResponse.ts";

const logger = eventLogger.getSubLogger({ name: "interactionCreate" });

export const interactionCreate: EventHandlers["interactionCreate"] =
  async function (bot, interaction) {
    if (interaction.data == null) {
      logger.error({
        eventType: "interactionCreate",
        message: "No data in interactioin request",
        interaction: interaction,
      });
      return await sendCustomInteractionErrorResponse(bot, interaction);
    }

    const commandName = interaction.data.name;
    const runCommand = runCommandMap.get(commandName);

    if (runCommand == null) {
      logger.error({
        eventType: "interactionCreate",
        message: "requested non-existent command",
        interaction: interaction,
      });
      return await sendCustomInteractionErrorResponse(bot, interaction);
    }

    return await runCommand(bot, interaction);
  };
