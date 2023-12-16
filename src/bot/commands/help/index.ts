import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand, SlashCommandHandler } from "../type.ts";
// import { commandOptionsParser } from "../commandOptionsParser.ts";
// import { BOT } from "../../bot.ts";
// import { niceHelp } from "../nice/index.ts";
// import { diceHelp } from "../dice/index.ts";

const execute: SlashCommandHandler = async (interaction) => {
  await interaction.reply(`This command hasn't implemented yet.`);

  // const args = commandOptionsParser(interaction);
  // if (args.all != null) {
  //   return await BOT.helpers.sendInteractionResponse(
  //     interaction.id,
  //     interaction.token,
  //     {
  //       type: InteractionResponseTypes.ChannelMessageWithSource,
  //       data: {
  //         content: "All command usages",
  //       },
  //     },
  //   );
  // }

  // if (args.nice != null) {
  //   return await BOT.helpers.sendInteractionResponse(
  //     interaction.id,
  //     interaction.token,
  //     niceHelp,
  //   );
  // }

  // if (args.dice != null) {
  //   return await BOT.helpers.sendInteractionResponse(
  //     interaction.id,
  //     interaction.token,
  //     diceHelp,
  //   );
  // }

  // // 使えるコマンド一覧を表示
  // return await BOT.helpers.sendInteractionResponse(
  //   interaction.id,
  //   interaction.token,
  //   {
  //     type: InteractionResponseTypes.ChannelMessageWithSource,
  //     data: {
  //       content: "Usage of this bot",
  //     },
  //   },
  // );
};

export const command: SlashCommand = {
  metadata: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Usages of this bot")
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("all")
        .setDescription("All command usages");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("nice")
        .setDescription("The usage of nice command");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("dice")
        .setDescription("The usage of dice command")
        .setDescriptionLocalization("ja", "/dice の使い方");
    }),
  execute: execute,
};
