import {
  ApplicationCommandOptionTypes,
  CreateSlashApplicationCommand,
  InteractionResponseTypes,
} from "@discordeno";
import { Secret } from "@utils/secret";
import { RunCommand } from "../type.ts";

// TODO: どっかに移す
const kv = await Deno.openKv();

export const commandInfo: CreateSlashApplicationCommand = {
  name: "nice",
  description: "Nice!",
  options: [{
    type: ApplicationCommandOptionTypes.User,
    name: "target",
    description: "Nice person",
    required: true,
    nameLocalizations: {
      ja: "対象者",
    },
  }],
};

export const runCommand: RunCommand = async (bot, interaction) => {
  // validation
  const options = interaction.data?.options;
  if (options == null) {
    throw Error("invalid request");
  }
  const target = options[0].value;
  if (target == null || typeof target !== "string") {
    throw Error("no user passed");
  }

  const member = await bot.helpers.getMember(Secret.GUILD_ID, target);
  const entry = await kv.get<number>([member.id]);
  const newPoint = entry.value != null ? entry.value + 1 : 1;
  await kv.set([member.id], newPoint);

  await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: `Nice! ${
        member.nick ?? member.user?.username
      }\ncurrent point: ${newPoint}`,
    },
  });
};
