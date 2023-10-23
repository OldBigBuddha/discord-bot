import { EventHandlers } from "@discordeno";

import { slashCommands } from "../commands/index.ts";
import { eventLogger } from "./logger.ts";
import { sendCustomInteractionErrorResponse } from "../helpers/errorResponse.ts";
import { SlashCommand } from "../commands/type.ts";

const logger = eventLogger.getSubLogger({ name: "interactionCreate" });

const commandMap: Map<string, SlashCommand> = new Map(
  slashCommands.map((c) => {
    return [c.name, c];
  })
);

export const interactionCreate: EventHandlers["interactionCreate"] =
  async function (_bot, interaction) {
    if (interaction.data == null) {
      logger.error({
        eventType: "interactionCreate",
        message: "No data in interactioin request",
        interaction: interaction,
      });
      return await sendCustomInteractionErrorResponse(interaction);
    }

    const commandName = interaction.data.name;
    const command = commandMap.get(commandName);

    if (command == null) {
      logger.error({
        eventType: "interactionCreate",
        message: "requested non-existent command",
        interaction: interaction,
      });
      return await sendCustomInteractionErrorResponse(interaction);
    }

    // interaction をもう少しよしなにパースしてやれると良さそう
    return await command.execute(interaction);
  };
