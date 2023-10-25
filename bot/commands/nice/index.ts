import {
  ApplicationCommandOptionTypes,
  Embed,
  InteractionResponse,
  InteractionResponseTypes,
  Member,
  User,
} from "@discordeno";
import { niceTo } from "@feature/nice";
import { BOT } from "../../bot.ts";
import { SlashCommand } from "../type.ts";
import { commandLogger } from "../logger.ts";
import { sendCustomInteractionErrorResponse } from "../../helpers/errorResponse.ts";
import { commandOptionsParser } from "../commandOptionsParser.ts";

const EMBED_COLOR_CODE = 0xff8000 as const;

const logger = commandLogger.getSubLogger({ name: "nice" });

function generateEmbed(username: string, point: number, message?: string | undefined): Embed {
  let description: string;
  if (message == null) {
    description = `${username} の nice point が ${point} になりました、やったね！`
  } else {
    description = `${username} の nice point が ${point} になりました、やったね！\nメッセージ: ${message}`;
  }
  return {
    title: "Nice work!",
    description: description,
    color: EMBED_COLOR_CODE,
  };
}

function generateHelpEmbed(): Embed {
  return {
    title: "/nice の使い方",
    description:
      "'/nice <ユーザー>'と入力すると対象のユーザーへ nice point を 1 追加することができます\nまた、任意でメッセージを追加することも可能です",
    color: EMBED_COLOR_CODE,
  };
}

function getName(member: Member, user: User): string {
  return member.nick ?? user.username ?? member.id.toString(10);
}

const execute: SlashCommand["execute"] = async (interaction) => {
  const args = commandOptionsParser(interaction);

  // nice は target 以外を引数に取らない
  if (args.target == null) {
    logger.warn({
      message: "requested non-existance command",
      interaction: interaction,
    });
    return sendCustomInteractionErrorResponse(
      interaction,
      "未登録のコマンドです",
    );
  }

  // check arguments
  if (args.target.user == null && args.target.member == null) {
    logger.error({
      message: "invalid argments",
      args: args,
    });
    return sendCustomInteractionErrorResponse(interaction);
  }

  const user = args.target.user as User;
  const member = args.target.member as Member;
  const message = args.message as string | undefined;

  try {
    const userId = user.id.toString(10);
    const newPoint = await niceTo(userId);

    return await BOT.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [generateEmbed(getName(member, user), newPoint, message)],
        },
      },
    );
  } catch (e) {
    logger.error({ message: "failed to calculate nice point", error: e });
    return await sendCustomInteractionErrorResponse(interaction);
  }
};

export const niceHelp: InteractionResponse = {
  type: InteractionResponseTypes.ChannelMessageWithSource,
  data: {
    embeds: [generateHelpEmbed()],
  },
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
    },
    {
      type: ApplicationCommandOptionTypes.String,
      name: "message",
      description: "The reason target is nice",
      required: false,
    },
  ],
  execute: execute
};
