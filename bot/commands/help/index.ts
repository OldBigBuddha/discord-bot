import {
  ApplicationCommandOptionTypes,
  InteractionResponseTypes,
} from "@discordeno";
import { SlashCommand } from "../type.ts";
import { commandOptionsParser } from "../commandOptionsParser.ts";
import { BOT } from "../../bot.ts";

const execute: SlashCommand["execute"] = async (interaction) => {
  const args = commandOptionsParser(interaction);

  if (args.all != null) {
    return await BOT.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "All command usages",
        },
      },
    );
  }

  if (args.nice != null) {
    return await BOT.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Usage of nice command",
        },
      },
    );
  }

  // 使えるコマンド一覧を表示
  return await BOT.helpers.sendInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Usage of this bot",
      },
    },
  );
};

export const command: SlashCommand = {
  name: "help",
  description: "Usages of this bot",
  options: [
    {
      name: "all",
      description: "All command usages",
      type: ApplicationCommandOptionTypes.SubCommand,
      required: false,
    },
    {
      name: "nice",
      description: "The usage of nice command",
      type: ApplicationCommandOptionTypes.SubCommand,
      required: false,
    },
  ],
  execute: execute,
};
