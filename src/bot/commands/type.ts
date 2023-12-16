import type { CacheType, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder, } from "discord.js";

export type SlashCommandHandler = (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;

export interface SlashCommand {
  readonly metadata: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  readonly execute: SlashCommandHandler;
}
