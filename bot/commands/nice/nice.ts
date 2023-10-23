import {
  ApplicationCommandOptionTypes,
  Embed,
  Interaction,
  InteractionResponseTypes,
  Member,
} from "@discordeno";
import { Secret } from "@utils/secret";
import { kv } from "@storage/kv";
import { BOT } from "../../bot.ts";
import { SlashCommand } from "../type.ts";
import { commandLogger } from "../logger.ts";
import { sendCustomInteractionErrorResponse } from "../../helpers/errorResponse.ts";
import { commandOptionsParser } from "../commandOptionsParser.ts";

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

async function executeHelp(interaction: Interaction) {
  return await BOT.helpers.sendInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "これは help です。",
      },
    },
  );
}

type KudosArgs = {
  userId: string;
};
async function executeKudos(interaction: Interaction, args: KudosArgs) {
  if (args == null) {
    logger.error({ message: "No arg passed" });
    return await sendCustomInteractionErrorResponse(interaction);
  }

  try {
    const member = await BOT.helpers.getMember(Secret.GUILD_ID, args.userId);

    // args.userId でも良いけど API から取れた情報を信用する
    const memberId = member.id.toString(10);

    const entry = await findEntry<number>([memberId]);
    const newPoint = entry?.value != null ? entry.value + 1 : 1;

    await setEntry([memberId], newPoint);

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
}

const execute: SlashCommand["execute"] = async (interaction) => {
  const args = commandOptionsParser(interaction);

  if (args.help != null) {
    return await executeHelp(interaction);
  }

  if (args.kudos != null) {
    const userId = args.kudos.user?.user?.id;
    if (typeof userId !== "bigint") {
      logger.error({
        message: "Args for kudos command are invalid",
        data: args,
      });
      return await sendCustomInteractionErrorResponse(interaction);
    }

    return await executeKudos(interaction, { userId: userId.toString(10) });
  }

  logger.warn({
    message: "requested non-existance command",
    interaction: interaction,
  });
  return sendCustomInteractionErrorResponse(
    interaction,
    "未登録のコマンドです",
  );
};

export const command: SlashCommand = {
  name: "nice",
  description: "Nice!",
  options: [
    {
      type: ApplicationCommandOptionTypes.SubCommand,
      name: "kudos",
      description: "Kudos to your friend!",
      required: false,
      options: [
        {
          type: ApplicationCommandOptionTypes.User,
          name: "user",
          description: "target",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.SubCommand,
      name: "help",
      description: "Usage for nice command",
      required: false,
    },
  ],
  execute: execute,
};
