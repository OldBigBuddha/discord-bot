// deno-lint-ignore-file no-explicit-any
// Fork from https://github.com/discordeno/discordeno/blob/1355d540354cf5d53048ed3c8a9d8f41fc71cd87/packages/bot/src/commandOptionsParser.ts
// 多分何かのミスでインポートできなくなっているので一時的に Fork
import {
  ApplicationCommandOptionTypes,
  Interaction,
  InteractionDataOption,
} from "@discordeno";

export function commandOptionsParser(
  interaction: Interaction,
  options?: InteractionDataOption[],
): Record<string, any> {
  if (!interaction.data) return {};
  if (!options) options = interaction.data.options ?? [];

  const args: Record<string, any> = {};

  for (const option of options) {
    switch (option.type) {
      case ApplicationCommandOptionTypes.SubCommandGroup:
      case ApplicationCommandOptionTypes.SubCommand:
        args[option.name] = commandOptionsParser(interaction, option.options);
        break;
      case ApplicationCommandOptionTypes.Channel:
        args[option.name] = interaction.data.resolved?.channels?.get(
          BigInt(option.value!),
        );
        break;
      case ApplicationCommandOptionTypes.Role:
        args[option.name] = interaction.data.resolved?.roles?.get(
          BigInt(option.value!),
        );
        break;
      case ApplicationCommandOptionTypes.User:
        args[option.name] = {
          user: interaction.data.resolved?.users?.get(BigInt(option.value!)),
          member: interaction.data.resolved?.members?.get(
            BigInt(option.value!),
          ),
        };
        break;
      case ApplicationCommandOptionTypes.Attachment:
        args[option.name] = interaction.data.resolved?.attachments?.get(
          BigInt(option.value!),
        );
        break;
      case ApplicationCommandOptionTypes.Mentionable:
        // Mentionable are roles or users
        args[option.name] =
          interaction.data.resolved?.roles?.get(BigInt(option.value!)) ?? {
            user: interaction.data.resolved?.users?.get(BigInt(option.value!)),
            member: interaction.data.resolved?.members?.get(
              BigInt(option.value!),
            ),
          };
        break;
      default:
        args[option.name] = option.value;
    }
  }

  return args;
}
