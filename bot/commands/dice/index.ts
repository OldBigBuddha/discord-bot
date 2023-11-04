import {
  ApplicationCommandOptionTypes,
  Embed,
  InteractionResponse,
  InteractionResponseTypes,
} from "@discordeno";
import { BOT } from "../../bot.ts";
import { commandOptionsParser } from "../commandOptionsParser.ts";
import { SlashCommand } from "../type.ts";
import { dice } from "@feature/dice";

type DiceArg = {
  readonly max: number;
  readonly quantity: number;
};

const EMBED_COLOR_CODE = 0xff0000 as const;

function generateHelpEmbed(): Embed {
  return {
    title: "/dice の使い方",
    description:
      "'/dice <最大値> <個数>'と入力すると結果が表示されます\n6d1 のdが先頭に来たと思えばOKです",
    color: EMBED_COLOR_CODE,
  };
}

export const diceHelp: InteractionResponse = {
  type: InteractionResponseTypes.ChannelMessageWithSource,
  data: {
    embeds: [generateHelpEmbed()],
  },
};

const execute: SlashCommand["execute"] = async (interaction) => {
  const { max, quantity } = commandOptionsParser(interaction) as DiceArg;
  const result = dice(max, quantity);

  return await BOT.helpers.sendInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: result.join(", "),
      },
    },
  );
};

export const command: SlashCommand = {
  name: "dice",
  description: "roll dices",
  options: [
    {
      name: "max",
      description: "Maximum value of a dice",
      type: ApplicationCommandOptionTypes.Number,
      required: true,
    },
    {
      name: "quantity",
      description: "Maximum value of a dice",
      type: ApplicationCommandOptionTypes.Number,
      required: true,
    },
  ],
  execute: execute,
};
