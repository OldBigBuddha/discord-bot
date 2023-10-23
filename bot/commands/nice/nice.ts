import {
  ApplicationCommandOptionTypes,
  Embed,
  Interaction,
  InteractionResponseTypes,
  Member,
  User,
} from "@discordeno";
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

function getName(member: Member, user: User): string {
  return member.nick ?? user.username ?? member.id.toString(10);
}

// 指しているユーザーは同じだが、得られる情報が違う
type KudosArgs = {
  member: Member;
  user: User;
};
async function executeKudos(interaction: Interaction, { user, member }: KudosArgs) {
  try {
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
          embeds: [generateEmbed(getName(member, user), newPoint)],
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

  if (args.target != null) {
    return await executeKudos(interaction, {
      member: args.target.member,
      user: args.target.user
    });
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
      type: ApplicationCommandOptionTypes.User,
      name: "target",
      description: "Kudos to who?",
      required: true,
    }
  ],
  execute: execute,
};
