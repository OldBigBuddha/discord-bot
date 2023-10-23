import { Bot, Embed, Interaction, InteractionResponseTypes } from "@discordeno";

const ERROR_COLOR_CODE = 0xbe0000 as const;

function generateErrorEmbed(message?: string): Embed {
  return {
    title: "予期せぬエラーが発生しました",
    description: message ?? "管理者へお問い合わせください",
    color: ERROR_COLOR_CODE,
  };
}

export async function sendCustomInteractionErrorResponse(
  bot: Bot,
  interaction: Interaction,
  message?: string,
) {
  await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      embeds: [generateErrorEmbed(message)],
    },
  });
}
