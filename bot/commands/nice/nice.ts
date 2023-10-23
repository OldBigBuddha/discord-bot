import {
  ApplicationCommandOptionTypes,
  Embed,
  InteractionResponseTypes,
  Member,
} from "@discordeno";
import { Secret } from "@utils/secret";
import { kv } from "@storage/kv";
import { BOT } from "../../bot.ts";
import { SlashCommand } from "../type.ts";
import { commandLogger } from "../logger.ts";
import { sendCustomInteractionErrorResponse } from "../../helpers/errorResponse.ts";

const KEY_NICE = "nice_key" as const;
const EMBED_COLOR_CODE = 0xff8000 as const;

const logger = commandLogger.getSubLogger({ name: "nice" });

async function findEntry<T>(
  keys: Deno.KvKeyPart[],
): Promise<Deno.KvEntryMaybe<T> | undefined> {
  return await kv.get<T>([KEY_NICE, ...keys]);
}

async function setEntry(
  keys: Deno.KvKeyPart[],
  value: unknown,
): Promise<Deno.KvCommitResult> {
  return await kv.set([KEY_NICE, ...keys], value);
}

function generateEmbed(username: string, point: number): Embed {
  return {
    title: "Nice work!",
    description:
      `${username} の nice point が ${point} になりました、やったね！`,
    color: EMBED_COLOR_CODE,
  };
}

function getUsername(member: Member): string {
  return member.nick ?? member.user?.username ?? String(member.id);
}

const execute: SlashCommand["execute"] = async (interaction) => {
  logger.debug(interaction);
  // validation
  const options = interaction.data?.options;
  if (options == null) {
    logger.error({ message: "'options' is undefined", data: interaction.data });
    return await sendCustomInteractionErrorResponse(interaction);
  }

  const target = options[0].value;
  if (target == null || typeof target !== "string") {
    logger.error({ message: "passed option is not string", options: options });
    return await sendCustomInteractionErrorResponse(interaction);
  }

  try {
    const member = await BOT.helpers.getMember(Secret.GUILD_ID, target);
    const entry = await findEntry<number>([member.id.toString(10)]);
    const newPoint = entry?.value != null ? entry.value + 1 : 1;
    await setEntry([member.id], newPoint);

    return await BOT.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [generateEmbed(getUsername(member), newPoint)],
        },
      },
    );
  } catch (e) {
    logger.error({ message: "failed to calculate nice point", error: e });
    return await sendCustomInteractionErrorResponse(interaction);
  }
};

export const command: SlashCommand = {
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
  execute: execute,
};

