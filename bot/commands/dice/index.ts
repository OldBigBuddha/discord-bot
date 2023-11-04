import { InteractionResponseTypes,ApplicationCommandOptionTypes } from "@discordeno";
import { BOT } from "../../bot.ts";
import { commandOptionsParser } from "../commandOptionsParser.ts";
import { SlashCommand } from "../type.ts";
import { commandLogger } from "../logger.ts";
import { dice } from "@feature/dice";

type DiceArg = {
    readonly max: number;
    readonly quantity: number;
}

const execute: SlashCommand["execute"] = async (interaction) => {
    const {max, quantity} = commandOptionsParser(interaction) as DiceArg;
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
  